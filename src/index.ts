import dotenv from 'dotenv';
import { Purrito } from './client';
import { connect } from 'mongoose';
import { logger } from 'shared';

// Initialise dotenv config - if you're doing config that way
dotenv.config();

connect(process.env.DATABASE_CONNECTION_STRING ?? '', {
  auth: {
    user: process.env.DATABASE_USER ?? '',
    password: process.env.DATABASE_PASSWORD ?? '',
  },
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
}).then(() => {
  logger.info('Connected to database');
});

new Purrito({ token: process.env.TOKEN });
