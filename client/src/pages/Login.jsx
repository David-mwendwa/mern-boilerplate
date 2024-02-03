import { Form, redirect, useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormRow from '../components/layout/FormRow';
import useInput from '../hooks/useInput';
import customFetch from '../utils/customFetch';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post('/user/login', data);
    toast.success('Logged in successfully');
    return redirect('/');
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.log(error);
    return error;
  }
};

const Login = () => {
  const navigate = useNavigation();
  const isSubmitting = /submitting/.test(navigate.state);

  const { email, password, handleChange } = useInput({
    email: '',
    password: '',
  });

  return (
    <div>
      <h1>Login</h1>
      <Form method='post'>
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

        <button type='submit' disabled={isSubmitting}>
          Login
        </button>
      </Form>
    </div>
  );
};

export default Login;
