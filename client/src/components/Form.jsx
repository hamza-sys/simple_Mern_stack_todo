import React from 'react'

const Form = ({ value, handleChange, handleSubmit }) => {
  return (
        <div>
            <h2 className='text-2xl text-center my-3 sm:text-3xl'>Todo List</h2>
          <form>
              <p className='font-bold'>Add Todo</p>
              <input className='border w-full p-2 my-2 focus:outline-none focus:border-indigo-500' type='text' placeholder='Add new Todo' name='name' value={value} onChange={handleChange} />
              <button className={`p-2 cursor-pointer rounded text-white ${!value ? 'bg-indigo-200' : 'bg-indigo-600'}`} type='submit' onClick={handleSubmit} disabled={!value}>Submit</button>
          </form>  
      </div>
  )
}

export default Form