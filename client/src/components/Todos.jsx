import React, { useEffect } from 'react'
import Todo from './Todo'

const Todos = ({todos, loadingTodos, handleToggleComplete, handleDeleteTodo}) => {

  return (
      <div className='flex flex-col gap-4 my-5'>
          {loadingTodos ? 'loading todos' : todos.length === 0 ? 'Nothing yet, add some todos' : todos.map((t, index) => (
              <Todo key={index} t={t} handleToggleComplete={handleToggleComplete} handleDeleteTodo={handleDeleteTodo} />
          ))}
    </div>
  )
}

export default Todos
