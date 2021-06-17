/**
* 在主应⽤⽬录执⾏ npm install
* @param args
* @param cwd
* @returns {Promise<void>}
*/
async function installPackage(args, cwd) {
    info(`Installing packages......`)
    const hasYarn = hasYarnProject(cwd)
    const command = hasYarn ? 'yarn' : 'npm'
    const installArgs = hasYarn ? ['--non-interactive', '--no-progress'] :
        ['install', '--quiet']
    // 执⾏命令
    await execCmd(command, installArgs, cwd, true)
    done(`Install packages!`)
}

/**
* 启动应⽤服务器
* @param args
* @param dest
* @returns {Promise<void>}
*/
function runServer(args, dest) {
    runSubServer(args, process.cwd(), dest)
    runMainServer(args, dest)
}
/**
* 启动⼦应⽤服务器
* @param args
* @param cwd
* @param dest
* @returns {Promise<void>}
*/
async function runSubServer(args, cwd = process.cwd(), dest) {
    const { command, serveArgs, port } = await getServeCmd(cwd, args.script)
    // 启动⼦项⽬前，先读取⼦项⽬中配置⽂件将其写⼊到主项⽬中的mock数据
    await setMicroAppMockData(args, port, dest)
    await execCmd(command, [...serveArgs], cwd, false)
}

/**
* 读取⼦项⽬中配置⽂件将其写⼊到主项⽬中的mock数据
* @param args
* @param port
* @param dest
*/
function setMicroAppMockData(args, port, dest) {
    const subAppConfig = config.getSubApp()
    if (subAppConfig) {
        if (subAppConfig.project) {
            const { project } = subAppConfig
            // 处理⼦应⽤entry
            const protocol = args.https ? 'https' : 'http'
            const host = args.host || subAppConfig.host
            let entryUrl = ''
            try {
                const entry = new URL(project.entry)
                entry.protocol = protocol
                entry.hostname = host
                entry.port = port
                entryUrl = entry.href
            } catch (err) {
                warn(`project.entry error! ${err.message}`)
                entryUrl = `${protocol}//${host}:${port}`
            }
            info(`sub app entry href: ${entryUrl}`)
            setMockFile(path.join(dest, config.mainAppConfig), [{
                ...project, entry: entryUrl
            }])
        }
        // 更新主应⽤内⼦应⽤对应的routers数据mock⽂件
        if (subAppConfig.routers && subAppConfig.project) {
            const routerFile = path.join(dest, config.subAppRouterDir,
                `${subAppConfig.project.key}.js`)
            setMockFile(routerFile, subAppConfig.routers)
        }
    }
}

/**
* 写⼊主应⽤mock⽂件
* @param file string
* @param content object
*/
function setMockFile(file, content) {
    const json = {
        data: content,
        code: 200,
        message: 'success'
    }
    const fileContent = `module.exports=${JSON.stringify(json)}`
    fs.writeFile(file, fileContent, (err) => {
        if (err) {
            warn(`${file} write error! ${err.message}`)
        } else {
            done(`${file} write success!`)
        }
    })
}

/**
* 启动主应⽤服务器
* @param args
* @param cwd
* @returns {Promise<void>}
*/
async function runMainServer(args, cwd) {
    const command = './node_modules/.bin/vue-cli-service'
    const serveArgs = ['serve']
    if (args.host) {
        serveArgs.push(...['--host', args.host])
    }
    if (args.open) {
        serveArgs.push(...['--open'])
    }
    // 主应⽤请求跨域限制，只⽀持本地3000端⼝号
    const port = await portfinder.getPortPromise({
        port: 3000
    })
    if (port !== 3000) {
        error(`主应⽤启动所需3000端⼝已被占⽤，${cwd}⽆法启动，请检查！`)
        process.exit(1)
    }
    serveArgs.push(...['--port', port])
    await execCmd(command, serveArgs, cwd, true)
}
