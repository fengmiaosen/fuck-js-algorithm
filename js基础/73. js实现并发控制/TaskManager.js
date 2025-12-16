// Requirements
// Implement a TaskManager class that manages asynchronous task execution with the following features:

// Configuration:
// limit: Maximum number of concurrent tasks
// retry: Default number of retry attempts for failed tasks

// Core Methods:

// add(task: MyFunction, priority: number, retryCount?: number): void
// Add a task to the queue with priority
// Higher priority numbers execute first
// Optional custom retry count (defaults to constructor retry value)
// Automatically triggers execution

// execute(): Promise<void>
// Execute tasks respecting the concurrency limit
// Handle task failures with retry logic
// Recursively process remaining tasks
// Maintain priority order

class TaskManager {
    constructor(limit = 1, retry = 0) {
        this.limit = limit;
        this.defaultRetry = retry;
        this.queue = [];
        this.activeCount = 0;
    }

    /**
     * Add a task to the queue
     * @param {Function} task - The async task function
     * @param {number} priority - Priority (higher executes first)
     * @param {number} retryCount - Optional custom retry count
     */
    add(task, priority = 0, retryCount = this.defaultRetry) {
        const taskItem = {
            task,
            priority,
            retryCount
        };

        this.queue.push(taskItem);
        // Maintain priority order (descending)
        this.queue.sort((a, b) => b.priority - a.priority);

        this.execute();
    }

    /**
     * Execute tasks respecting concurrency limit
     */
    async execute() {
        while (this.activeCount < this.limit && this.queue.length > 0) {
            const item = this.queue.shift();
            this.activeCount++;
            
            // Execute the task without awaiting it here to allow concurrency
            this._runTask(item);
        }
    }

    /**
     * Internal method to run a single task wrapper
     */
    async _runTask(item) {
        try {
            await item.task();
        } catch (error) {
            console.log(`Task failed. Retries left: ${item.retryCount}`);
            if (item.retryCount > 0) {
                item.retryCount--;
                // Re-add to queue and maintain priority
                this.queue.push(item);
                this.queue.sort((a, b) => b.priority - a.priority);
            }
        } finally {
            this.activeCount--;
            // Trigger next task
            this.execute();
        }
    }
}

// ==========================================
// Test Usage
// ==========================================

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tm = new TaskManager(2, 1); // limit 2, default retry 1

console.log('--- Start ---');

// Task 1: Priority 1, 1000ms
tm.add(async () => {
    console.log('Start Task 1 (P1)');
    await sleep(1000);
    console.log('End Task 1');
}, 1);

// Task 2: Priority 2, 500ms (High priority)
tm.add(async () => {
    console.log('Start Task 2 (P2)');
    await sleep(500);
    console.log('End Task 2');
}, 2);

// Task 3: Priority 3, 200ms (Highest priority), will fail once
let t3Fail = true;
tm.add(async () => {
    console.log('Start Task 3 (P3)');
    await sleep(200);
    if (t3Fail) {
        t3Fail = false;
        throw new Error('Task 3 failed intentionally');
    }
    console.log('End Task 3');
}, 3);

// Task 4: Priority 0, 300ms
tm.add(async () => {
    console.log('Start Task 4 (P0)');
    await sleep(300);
    console.log('End Task 4');
}, 0);
