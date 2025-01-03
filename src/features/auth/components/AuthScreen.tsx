'use client';

import React, { useState } from 'react';
import { SignInFlow } from '../type';
import { SignUp } from './SignUp';
import { SignIn } from './SignIn';

export const AuthScreen = () => {
        const [state, setState] = useState<SignInFlow>('signIn');
        return (
                <div className="h-full flex items-center justify-center bg-[#5C3B58]">
                        <div className="md:h-auto md:w-[480px]">
                                {state === 'signIn' ? <SignIn setState={setState} /> : <SignUp setState={setState} />}
                        </div>
                </div>
        );
};
