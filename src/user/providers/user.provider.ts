import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { USER_REPOSITORY } from '.';

export const userProvider =[{
    provide: USER_REPOSITORY,
    useValue: User,
}]
