## Multi-part table with formik example

This is based on the tutorial by Bruno Antunes at [React multi-step form tutorial](https://www.youtube.com/watch?v=l3NEC4McW3g&t=2424s).

### Approach

1. First install formik, formik-mui, @mui/material, and yup from npm or yarn.
1. Import Formik, Form, and Field from formik. Make a standard formik object with a form within, and fields within the form.
1. The formik component requires initialValues, and onSubmit. The initial values sets the initial values of the corresponding fields with the same names, thus ensure that the keys in the initial values object corresponds directly to the keys in initial values.
1. Use TextField, CheckboxWithLabel from formik-material as the component property within the Fields. Use the fullwidth property within the fields for better visibility.
1. Create a FormikStepper wrapper component that takes props of the same type as Formik (i.e. FormikConfig\<FormikValues>). Deconstruct the props of this into children, and ...props. 
1. In the return within this component put in \<Formik>. Pass on the props of FormikStepper to Formik.
1. Then give the <Formik> component one child, and one child only <Form>.
1. Inside form put in {children} which was destructured out of props in FormikStepper.
1. Then in the original App.tsx, replace the Formik component with FormikStepper.
1. Separate out what should go on each step of the Formik form with a new Wrapper Component called FormikStep which we will soon define.
1. The FormikStep Wrapper component is to be made. It will take children and validationSchema from Formik, as well as a new label property. Therefore, we create an interface to define its type. This type is an interface which extends Pick<FormikConfig\<FormikValues> 'children' | 'validationSchema'>. This FormikStep Wrapper will simply return its children which is destructured out of its props.
1. Give each step a validationSchema using a yup object. For one Field that is reliant on another field use money: mixed().when('millionaire', {is: true, then: number().required().min(1_000_000, 'Since you said you're  millionaire you need atleast a million dollars')})
1. In FormikStepper, create a state called step and set to an initial value of zero. Use the step number to create a childrenArray variable which is equal to React.Children.toArray(children) as React.ReactElement\<FormikStepProps>[]. Then create a currentChild that is equal to childrenArray[step].
1. Inside the Form element in Formik return the currentChild below the stepper.
1. Bring in the Stepper from material UI. You'll have to import a bunch of things for it to work. Set the stepper to alternativeLabel (to show below) and activeStep=step to reflect the state called step.
1. It takes a Step and StepLabel, map these from childrenArray.
1. Below the form using a Grid and Grid items create two Buttons. One of type submit and another of type button. The submit button will ensure validation is automatically done before it can proceed. In the onclick of Formik, if step is less than the last step, run one function, else do the submit thing by passing in values, helpers as props and then calling props.onSubmit(values, helpers). This can be done by creating a isLastStep function to find out when the last step is there. When the submit button is clicked on the last step set a state called completed to true. Make sure that the whole function is an async, await one.
1. In the submit functions be sure to make it an async await function.
1.  In the Step set the completed property of Step equal to complete if step > index or is completed.
1. Destructure isSubmitting from the props of Formik and pass it in as props into a function that is inside the FormikStepper. Set disabled = {isSubmitting} in the buttons. Set the startIcon in the submit button equal to CircularProgress which is brought in from @mui/material.
1. Create a sleep function to mimic a fetch request. 
    ```
    const sleep = async (time:number) => new Promise(acc => setTimeOut(acc, time);
    ```
1. Set the FormikStepper onSubmit function to sleep for three minutes and then console.log the values that are passed into it. If you want you can use the helpers.reset() to empty the form and you could move the step to 0 to send to the beginning of the form, or ideally, you should send them to a Thank you screen.
