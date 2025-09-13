
### git rebase & git cherry-pick

git rebase 主要用于整合分支，使历史提交更线性，适合在开发过程中调整提交顺序。
git cherry-pick 适合选择性地将特定提交应用到当前分支，便于快速引入特定的改动

以下是 `git rebase` 和 `git cherry-pick` 的具体事例，帮助您更好地理解它们的用法。

### git rebase 示例

#### 场景
假设您有两个分支：`main` 和 `feature`。在 `main` 分支上有几个新提交，而您想将 `feature` 分支的更改应用到最新的 `main` 上。

1. **查看分支**：
   ```bash
   git checkout main
   git log --oneline
   ```

2. **在 `main` 上创建一个新提交**：
   ```bash
   git checkout -b feature
   echo "Feature work" >> feature.txt
   git add feature.txt
   git commit -m "Add feature work"
   ```

3. **在 `main` 上添加更多提交**：
   ```bash
   git checkout main
   echo "Update readme" >> README.md
   git add README.md
   git commit -m "Update README"
   ```

4. **进行 rebase**：
   ```bash
   git checkout feature
   git rebase main
   ```

   这将把 `feature` 分支的提交移到 `main` 分支的最新提交之上。

5. **处理冲突**（如有）：
   - Git 会提示您解决冲突，解决后执行：
   ```bash
   git add <resolved-file>
   git rebase --continue
   ```

### git cherry-pick 示例

#### 场景
假设您在 `main` 分支上做了一些提交，现在您想将其中某个特定的提交应用到 `feature` 分支上。

1. **查看提交历史**：
   ```bash
   git checkout main
   git log --oneline
   ```

   假设您看到的提交历史如下：
   ```
   a1b2c3d Update README
   e4f5g6h Fix bug in feature
   i7j8k9l Add feature work
   ```

2. **切换到 `feature` 分支**：
   ```bash
   git checkout feature
   ```

3. **选择性应用某个提交**：
   ```bash
   git cherry-pick e4f5g6h
   ```

   这将把 `Fix bug in feature` 这个特定的提交应用到 `feature` 分支。

4. **处理冲突**（如有）：
   - 如果遇到冲突，解决后执行：
   ```bash
   git add <resolved-file>
   git cherry-pick --continue
   ```

### 总结

- **`git rebase`** 用于将整个分支的改动移到另一分支的顶部，保持历史整洁。
- **`git cherry-pick`** 用于将特定的提交应用到当前分支，灵活选择需要的更改。 

