import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {createGoal} from '../features/goals/goalSlice'

function GoalForm() {

    const [text, setText] = useState('')

    const dispatch = useDispatch()

    const onSubmit = function(e) {
        e.preventDefault()

        dispatch(createGoal({text}))
        setText('')
    }

    return (
        <section className='form'>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor='text'>Goal</label>
                    <input 
                        name='text' 
                        id='text' 
                        value={text} 
                        onChange={(e) => {setText(e.target.value)}}
                    /> 
                </div>
                <form className='form-group'>
                    <button className='btn btn-block' type='submit'>
                        Add Goal
                    </button>
                </form>
            </form>
        </section>
    )
}

export default GoalForm