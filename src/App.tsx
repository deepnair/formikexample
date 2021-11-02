import React from 'react';
import {useState} from 'react';
import './App.css';
import {Formik, Form, Field, FormikConfig, FormikValues} from 'formik';
import {object, mixed, number, string} from 'yup';
import {TextField, CheckboxWithLabel} from 'formik-mui';
import {Box, Stepper, Step, Grid, StepLabel, CircularProgress, Button} from '@mui/material'

function App() {
  const sleep = async(time: number) => new Promise(acc => setTimeout(acc, time));

  return (
    <div className="container">
      <FormikStepper
        initialValues = {{
          firstname: '',
          lastname: '',
          millionaire: false,
          money: 0,
          description: ''

        }}
      onSubmit={async (values, helpers) => {
        await sleep(3000);
        console.log(values)
      }}>
        
          <FormikStep label='Personal details' validationSchema={object({
            firstname: string().required().min(1, 'Please put in your first name'),
            lastname: string().required().min(2, 'Please put in your last name')
          })}>
            <Box padding={2}>
            <Field fullWidth name='firstname' type='text' component={TextField} label='First Name'/>
            </Box>
            <Box padding={2}>
            <Field fullWidth name='lastname' type='text' component={TextField} label='Last Name'/>
            </Box>
            <Box padding={2}>
            <Field name='millionaire' type='checkbox' component={CheckboxWithLabel} Label={{label:'Are you a millionaire'}} />
            </Box>
          </FormikStep>
          <FormikStep label='Financial information' validationSchema = 
              {object({
                money: mixed().when('millionaire', {
                  is: true,
                  then: number().required().min(1_000_000, 'Since you said you are a millionaire, you need to have atleast 1 million'),
                  otherwise: number().required('Please put in a number'),
                })
              })}>
            <Box padding={2}>
            <Field fullWidth name='money' type='number' component={TextField} label='How much money do you have?'/>
            </Box>
          </FormikStep>
          <FormikStep label='Final info'>
            <Box padding={2}>
            <Field fullWidth name='description' type='textarea' component={TextField} label='Describe your wealth'/>
            </Box>
          </FormikStep>

      </FormikStepper>
      
    </div>
  );
}

export interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'>{
  label: string
}

export function FormikStep({children}: FormikStepProps){
  return(
    <>
      {children}
    </>
  )
}

export function FormikStepper ({children, ...props}: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0)
  const currentChild = childrenArray[step]
  const [completed, setCompleted] = useState(false);
  const isLastStep = () => {
    if (step === childrenArray.length-1){
      return true;
    }else{
      return false;
    }
  }
  
  return (

    <Formik {...props} onSubmit={async (values, helpers) => {
      if (isLastStep()){
        setCompleted(true);
        await props.onSubmit(values, helpers);
      }else{
          setStep(step + 1)}
      }
      } validationSchema={currentChild.props.validationSchema}>
      
      {({isSubmitting}) => (
        <Form>
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => {
              
                return (<Step key={child.props.label} completed={step > index || completed}>
                  <StepLabel>{child.props.label}</StepLabel>
                </Step>)
            })}
          </Stepper>
          {currentChild}
          <Grid container spacing={2}>
          {step > 0 && 
          <Grid item>
            <Button color='primary' disabled={isSubmitting} type='button' onClick={() => setStep(step - 1)}>Back</Button>
          </Grid>}          
          <Grid item>
            <Button color='primary' disabled={isSubmitting} startIcon={isSubmitting && <CircularProgress size="1rem"/>} className='primary' type='submit'>{step < childrenArray.length-1 ? 'Next' : 'Submit'}</Button>
          </Grid>

          </Grid>
        </Form>
      )}
      
    </Formik>
  )
}

export default App;
