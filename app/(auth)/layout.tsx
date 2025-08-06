// src/components/layout/AuthLayout.tsx

import { ChildProps } from '@/types';
import { FC } from 'react';

const AuthLayout: FC<ChildProps> = ({ children }) => {
    return (
        <section className='flex justify-center mt-20 sm:mt-44 p-4'>
            {children}
        </section>
    );
};

export default AuthLayout;