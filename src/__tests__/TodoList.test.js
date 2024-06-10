import React from 'react'
import {fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import TodoList from '../components/TodoList'

beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          { title: 'Todo 1', completed: false },
          { title: 'Todo 2', completed: true },
        ]),
      })
    );
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  test('renders todos from API', async () => {
    render(<TodoList />);
  
    // Wait for the todos to be rendered
    const todoItems = await waitFor(() => screen.getAllByRole('listitem'));
    expect(todoItems).toHaveLength(2);
    expect(todoItems[0]).toHaveTextContent('Todo 1');
    expect(todoItems[1]).toHaveTextContent('Todo 2');
  });

test('adds a new todo to the list', () => {
    render(<TodoList />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Learn TDD' } })

    const addButton = screen.getByRole('button', { name: /add todo/i })
    fireEvent.click(addButton)

    const newTodo =screen.getByText('Learn TDD')
    expect(newTodo).toBeInTheDocument()
})

test('does not mutate the original list', () => {
    render(<TodoList />)

    const input =screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: "Learn React" } })
    const addButton = screen.getByRole('button', { name: /add todo/i })
    fireEvent.click(addButton)

    fireEvent.change(input, { target: { value: 'Learn TDD' } })
    fireEvent.click(addButton)

    const todos = screen.getAllByRole('listitem');
    expect(todos.length).toBe(2);
    expect(todos[0]).toHaveTextContent('Learn React');
    expect(todos[1]).toHaveTextContent('Learn TDD');
})