import {
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

/**
 
 USER

 */
export interface User {
  username:    string;
  session:     CognitoUserSession;
  credentials: AWS.Credentials | null;
}