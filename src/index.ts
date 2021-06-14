import dotenv from 'dotenv';
import { Purrito } from './types/client';

// Initialise dotenv config - if you're doing config that way
dotenv.config();

new Purrito({ token: process.env.TOKEN });
