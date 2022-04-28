import React, { useState, useCallback,useEffect } from "react";
import NewExpense from "./components/NewExpense/NewExpense";
import Expenses from "./components/Expenses/Expenses";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://expense-tracker-55e87-default-rtdb.firebaseio.com/expenses.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
          date: data[key].date,
        });
      }
      console.log(loadedMovies);
      setExpenses(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  },[]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addExpenseHandler(movie) {
    const response = await fetch(
      "https://expense-tracker-55e87-default-rtdb.firebaseio.com/expenses.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    fetchMoviesHandler();
  }

  let content = <p>Found no movies.</p>;

  if (expenses.length > 0) {
    content = <Expenses items={expenses} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }
  return (
    <div>
      <NewExpense onAddExpense={addExpenseHandler} />
      <section>{content}</section>
    </div>
  );
};

export default App;
