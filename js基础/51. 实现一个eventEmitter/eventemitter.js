// Requirements
// Implement an EventEmitter class in TypeScript that supports the publish-subscribe pattern with the following methods:

// Core Methods:

// on(eventName: string, callback: Listener): () => void
// Subscribe a callback function to an event
// Multiple callbacks can be registered for the same event
// Returns an unsubscribe function that removes this specific callback

// off(eventName: string, callback: Listener): void
// Unsubscribe a specific callback from an event
// Should clean up the event entry if no listeners remain

// once(eventName: string, callback: Listener): () => void
// Subscribe a callback that will only execute once
// Automatically unsubscribe after first execution
// Returns an unsubscribe function

// emit(eventName: string, ...args: any[]): void
// Trigger all callbacks registered for an event
// Pass arguments to all listener callbacks
// Handle errors gracefully (try-catch around each listener)

class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    /**
     * Subscribe a callback function to an event
     * @param {string} eventName
     * @param {Function} callback
     * @returns {Function} unsubscribe function
     */
    on(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        
        const listeners = this.events.get(eventName);
        listeners.push(callback);

        // Return unsubscribe function
        return () => {
            this.off(eventName, callback);
        };
    }

    /**
     * Unsubscribe a specific callback from an event
     * @param {string} eventName
     * @param {Function} callback
     */
    off(eventName, callback) {
        if (!this.events.has(eventName)) return;

        const listeners = this.events.get(eventName);
        const index = listeners.indexOf(callback);

        if (index !== -1) {
            listeners.splice(index, 1);
        }

        // Clean up if no listeners remain
        if (listeners.length === 0) {
            this.events.delete(eventName);
        }
    }

    /**
     * Subscribe a callback that will only execute once
     * @param {string} eventName
     * @param {Function} callback
     * @returns {Function} unsubscribe function
     */
    once(eventName, callback) {
        const wrapper = (...args) => {
            // Unsubscribe first to prevent re-triggering if callback emits the same event
            this.off(eventName, wrapper);
            try {
                callback(...args);
            } catch (error) {
                console.error(`Error in 'once' listener for event '${eventName}':`, error);
            }
        };

        // Store original callback reference to allow manual unsubscribe if needed (optional but good practice)
        wrapper.originalCallback = callback;

        return this.on(eventName, wrapper);
    }

    /**
     * Trigger all callbacks registered for an event
     * @param {string} eventName
     * @param  {...any} args
     */
    emit(eventName, ...args) {
        if (!this.events.has(eventName)) return;

        // Clone listeners array to avoid issues if listeners are modified during emission
        const listeners = [...this.events.get(eventName)];

        listeners.forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`Error in listener for event '${eventName}':`, error);
            }
        });
    }
}

// ==========================================
// Test Usage
// ==========================================

const emitter = new EventEmitter();

console.log('--- Start Tests ---');

// Test 1: Basic on/emit
const logData = (data) => console.log('Data received:', data);
const unsub = emitter.on('data', logData);
console.log('Emitting data 1:');
emitter.emit('data', 'test 1');

// Test 2: Unsubscribe
unsub();
console.log('Emitting data 2 (should not fire):');
emitter.emit('data', 'test 2');

// Test 3: Once
console.log('Setting up once listener:');
emitter.once('single', (msg) => console.log('Single shot:', msg));
emitter.emit('single', 'First shot');
emitter.emit('single', 'Second shot (should not fire)');

// Test 4: Multiple listeners
console.log('Multiple listeners:');
emitter.on('multi', () => console.log('Listener 1'));
emitter.on('multi', () => console.log('Listener 2'));
emitter.emit('multi');

// Test 5: Error handling
console.log('Error handling:');
emitter.on('error-test', () => {
    throw new Error('Oops!');
});
emitter.on('error-test', () => console.log('This should still run'));
emitter.emit('error-test');

console.log('--- End Tests ---');
