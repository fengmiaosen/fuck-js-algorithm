// 并发请求控制函数 

// Example usage
const urls = [
    'https://api.example.com/data1',
    'https://api.example.com/data2',
    'https://api.example.com/data3',
    // Add more URLs as needed
];

const limit = 2;

async function concurrentRequests(urls, limit) {
    const results = [];
    const inFlightRequests = [];

    async function makeRequest(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            results.push(data);
        } catch (error) {
            results.push({ error: error.message });
        }
    }

    for (let i = 0; i < urls.length; i++) {
        const request = makeRequest(urls[i]);
        inFlightRequests.push(request);

        if (inFlightRequests.length === limit || i === urls.length - 1) {
            await Promise.all(inFlightRequests);
            inFlightRequests.length = 0;
        }
    }

    return results;
}

concurrentRequests(urls, limit)
    .then(results => console.log(results))
    .catch(error => console.error(error));