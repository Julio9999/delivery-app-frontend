import { type FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/api/auth/auth';
import { useAuthSession } from '@/hooks/use-auth-session';
import { showErrorToast, showSuccessToast } from '@/lib/utils';

type LocationState = {
    from?: string;
};

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isLoading, refreshSession } = useAuthSession();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const from = (location.state as LocationState | null)?.from ?? '/';
    const redirectTo = from === '/login' ? '/' : from;

    if (!isLoading && isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await authApi.login({
                name,
                password,
            });
            await refreshSession();

            showSuccessToast('Bienvenido');
            navigate(redirectTo, { replace: true });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                showErrorToast('Usuario o contrasena invalidos');
            } else {
                toast.error('Error inesperado al iniciar sesion');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Iniciar sesion</CardTitle>
                    <CardDescription>Accede al panel administrativo.</CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Usuario</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="admin"
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Contrasena</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="********"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <Button className="w-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};