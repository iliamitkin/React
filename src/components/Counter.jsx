import React from "react";

function Counter({ initialValue = 0 }) {
  const [count, setCount] = React.useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return (
    <div>
      <h2 data-testid="counter-title">Counter: {count}</h2>
      <button data-testid="increment-btn" onClick={increment}>
        Increment
      </button>
      <button data-testid="decrement-btn" onClick={decrement}>
        Decrement
      </button>
      <button data-testid="reset-btn" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

export default Counter;