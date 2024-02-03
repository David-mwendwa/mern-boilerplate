import { Form, redirect, useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormRow from '../components/layout/FormRow';
import useInput from '../hooks/useInput';
import customFetch from '../utils/customFetch';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post('/user/register', data);
    toast.success('Registered successfully');
    return redirect('/login');
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.log(error);
    return error;
  }
};

const Register = () => {
  const navigate = useNavigation();
  const isSubmitting = /submitting/.test(navigate.state);

  const { name, email, password, passwordConfirm, handleChange } = useInput({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  return (
    <div>
      <h1>Login</h1>
      <Form method='post'>
        <FormRow
          type='text'
          name='name'
          value={name}
          onChange={handleChange}
          labelText='Name'
          defaultValue='David Mwen'
        />
        <FormRow
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          labelText='Email'
          defaultValue='david@gmail.com'
        />
        <FormRow
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          labelText='Password'
          defaultValue='david123'
        />
        <FormRow
          type='password'
          name='passwordConfirm'
          value={passwordConfirm}
          onChange={handleChange}
          labelText='Confirm Password'
          defaultValue='david123'
        />

        <button type='submit' disabled={isSubmitting}>
          Register
        </button>
      </Form>
    </div>
  );
};

export default Register;
