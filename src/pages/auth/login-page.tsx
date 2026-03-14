import { type FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
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
import { authClient } from '@/lib/auth-client';

type LocationState = {
    from?: string;
};

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data: session, isPending } = authClient.useSession();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const from = (location.state as LocationState | null)?.from ?? '/';

    if (!isPending && session) {
        return <Navigate to={from} replace />;
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await authClient.signIn.email({
                email,
                password,
            });

            if (result.error) {
                toast.error(result.error.message || 'No se pudo iniciar sesion');
                return;
            }

            toast.success('Bienvenido');
            navigate(from, { replace: true });
        } catch {
            toast.error('Error inesperado al iniciar sesion');
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
                            <Label htmlFor="email">Correo</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="admin@ejemplo.com"
                                autoComplete="email"
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