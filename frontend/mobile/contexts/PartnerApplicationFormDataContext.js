import React, {createContext, useContext, useState} from 'react';

const FormDataContext = createContext();

export const useFormData = () => {
    return useContext(FormDataContext);
};

// Store the FormData in a context.
export const FormDataProvider = ({children}) => {
    const [formData, setFormData] = useState({});
    return (
        <FormDataContext.Provider value={{formData, setFormData}}>
            {children}
        </FormDataContext.Provider>
    );
};
