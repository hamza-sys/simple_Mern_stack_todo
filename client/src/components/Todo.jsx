import React from 'react'

import { BsCheck } from 'react-icons/bs'
import {BsX} from 'react-icons/bs'

const Todo = ({t, handleToggleComplete, handleDeleteTodo}) => {

  return (
      <div className='border-2 flex justify-between align-center p-3'>
        <p className={`${t.completed ? 'line-through' : ''}`}>{t.name}</p>
      <div className='flex gap-2'>
        <BsCheck className='border bg-red-40 w-8 h-8 cursor-pointer text-green-500 hover:bg-green-500 hover:text-white transition hover:ease-in duration-200 hover:border-none' onClick={() => handleToggleComplete(t._id)} />
        <BsX className='border w-8 h-8 cursor-pointer text-red-500 hover:bg-red-500 hover:text-white transition hover:ease-in duration-200 hover:border-none' onClick={() => handleDeleteTodo(t._id)} />
      </div>
    </div>  
  )
}

export default Todo