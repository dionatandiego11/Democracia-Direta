import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth');

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('LoginForm', () => {
  it('allows the user to authenticate', async () => {
    const loginMock = jest.fn().mockResolvedValue(undefined);
    mockedUseAuth.mockReturnValue({
      token: null,
      user: null,
      isAuthenticated: false,
      login: loginMock,
      logout: jest.fn(),
      isLoading: false,
      error: null
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(loginMock).toHaveBeenCalledWith('user@example.com', 'password');
  });
});
