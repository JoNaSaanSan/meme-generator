import React from 'react';

const Form = () => {
    return (
        <form>
            <label htmlFor="meme">Meme Settings</label>
            <input type="text" class="inputClass"/>
            <input type="color" class="inputClass" />
        </form>
    );
};

export default Form;