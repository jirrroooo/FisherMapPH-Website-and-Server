import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';

import { Query } from 'express-serve-static-core';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async newUser(user: User): Promise<User> {
    const res = await this.userModel.create(user);
    return res;
  }


  async getAdminUsers(query: Query): Promise<User[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    if (query.search) {
      if (query.searchBy != 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find(
              query.searchBy == 'first_name'
                ? {
                    first_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: true,
                    user_type: { $in: ['admin', 'superadmin'] },
                  }
                : {
                    last_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: true,
                    user_type: { $in: ['admin', 'superadmin'] },
                  },
            )
            .sort(
              query.sort == 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: 1 }
                : query.sort != 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: -1 }
                : query.sort == 'alphabetical' && query.searchBy == 'last_name'
                ? { last_name: 1 }
                : { last_name: -1 },
            )
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const alphabetical = this.userModel
          .find(
            query.searchBy == 'first_name'
              ? {
                  first_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: true,
                  user_type: { $in: ['admin', 'superadmin'] },
                }
              : {
                  last_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: true,
                  user_type: { $in: ['admin', 'superadmin'] },
                },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);

        return alphabetical;
      } else if (query.searchBy == 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find({
              email_address: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: true,
              user_type: { $in: ['admin', 'superadmin'] },
            })
            .sort({ email_address: query.sort == 'alphabetical' ? 1 : -1 })
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const searchByEmail = await this.userModel.find({
          email_address: new RegExp(`${query.email}`, 'i'),
          isAuthenticated: true,
          user_type: { $in: ['admin', 'superadmin'] },
        });
        return searchByEmail;
      }

      const searchByName = await this.userModel.find(
        query.searchBy == 'first_name'
          ? {
              first_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: true,
              user_type: { $in: ['admin', 'superadmin'] },
            }
          : {
              last_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: true,
              user_type: { $in: ['admin', 'superadmin'] },
            },
      );

      return searchByName;
    }

    const users = await this.userModel
      .find({
        isAuthenticated: true,
        user_type: { $in: ['admin', 'superadmin'] },
      })
      .sort({ createdAt: -1 })
      .limit(responsePerPage)
      .skip(skip);

    return users;
  }



  async getAdminPendingUsers(query: Query): Promise<User[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    if (query.search) {
      if (query.searchBy != 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find(
              query.searchBy == 'first_name'
                ? {
                    first_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: false,
                    user_type: { $in: ['admin', 'superadmin'] },
                  }
                : {
                    last_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: false,
                    user_type: { $in: ['admin', 'superadmin'] },
                  },
            )
            .sort(
              query.sort == 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: 1 }
                : query.sort != 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: -1 }
                : query.sort == 'alphabetical' && query.searchBy == 'last_name'
                ? { last_name: 1 }
                : { last_name: -1 },
            )
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const alphabetical = this.userModel
          .find(
            query.searchBy == 'first_name'
              ? {
                  first_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: false,
                  user_type: { $in: ['admin', 'superadmin'] },
                }
              : {
                  last_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: false,
                  user_type: { $in: ['admin', 'superadmin'] },
                },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);

        return alphabetical;
      } else if (query.searchBy == 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find({
              email_address: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: { $in: ['admin', 'superadmin'] },
            })
            .sort({ email_address: query.sort == 'alphabetical' ? 1 : -1 })
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const searchByEmail = await this.userModel.find({
          email_address: new RegExp(`${query.email}`, 'i'),
          isAuthenticated: false,
          user_type: { $in: ['admin', 'superadmin'] },
        });
        return searchByEmail;
      }

      const searchByName = await this.userModel.find(
        query.searchBy == 'first_name'
          ? {
              first_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: { $in: ['admin', 'superadmin'] },
            }
          : {
              last_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: { $in: ['admin', 'superadmin'] },
            },
      );

      return searchByName;
    }

    const users = await this.userModel
      .find({
        isAuthenticated: false,
        user_type: { $in: ['admin', 'superadmin'] },
      })
      .sort({ createdAt: -1 })
      .limit(responsePerPage)
      .skip(skip);

    return users;
  }


  async getAdminRejectedUsers(query: Query): Promise<User[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    if (query.search) {
      if (query.searchBy != 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find(
              query.searchBy == 'first_name'
                ? {
                    first_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: false,
                    user_type: { $in: ['admin-rejected', 'superadmin-rejected'] },
                  }
                : {
                    last_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: false,
                    user_type: { $in: ['admin-rejected', 'superadmin-rejected'] },
                  },
            )
            .sort(
              query.sort == 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: 1 }
                : query.sort != 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: -1 }
                : query.sort == 'alphabetical' && query.searchBy == 'last_name'
                ? { last_name: 1 }
                : { last_name: -1 },
            )
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const alphabetical = this.userModel
          .find(
            query.searchBy == 'first_name'
              ? {
                  first_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: false,
                  user_type: { $in: ['admin-rejected', 'superadmin-rejected'] },
                }
              : {
                  last_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: false,
                  user_type: { $in: ['admin-rejected', 'superadmin-rejected'] },
                },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);

        return alphabetical;
      } else if (query.searchBy == 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find({
              email_address: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: { $in: ['admin-rejected', 'superadmin-rejected'] },
            })
            .sort({ email_address: query.sort == 'alphabetical' ? 1 : -1 })
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const searchByEmail = await this.userModel.find({
          email_address: new RegExp(`${query.email}`, 'i'),
          isAuthenticated: false,
          user_type: { $in: ['admin-rejected', 'superadmin-rejected'] },
        });
        return searchByEmail;
      }

      const searchByName = await this.userModel.find(
        query.searchBy == 'first_name'
          ? {
              first_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: { $in: ['admin-rejected', 'superadmin-rejected'] },
            }
          : {
              last_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: { $in: ['admin-rejected', 'superadmin-rejected'] },
            },
      );

      return searchByName;
    }

    const users = await this.userModel
      .find({
        isAuthenticated: false,
        user_type: { $in: ['admin-rejected', 'superadmin-rejected'] },
      })
      .sort({ createdAt: -1 })
      .limit(responsePerPage)
      .skip(skip);

    return users;
  }


  async getFisherfolkUsers(query: Query): Promise<User[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    if (query.search) {
      if (query.searchBy != 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find(
              query.searchBy == 'first_name'
                ? {
                    first_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: true,
                    user_type: 'user',
                  }
                : {
                    last_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: true,
                    user_type: 'user',
                  },
            )
            .sort(
              query.sort == 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: 1 }
                : query.sort != 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: -1 }
                : query.sort == 'alphabetical' && query.searchBy == 'last_name'
                ? { last_name: 1 }
                : { last_name: -1 },
            )
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const alphabetical = this.userModel
          .find(
            query.searchBy == 'first_name'
              ? {
                  first_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: true,
                  user_type: 'user',
                }
              : {
                  last_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: true,
                  user_type: 'user',
                },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);

        return alphabetical;
      } else if (query.searchBy == 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find({
              email_address: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: true,
              user_type: 'user',
            })
            .sort({ email_address: query.sort == 'alphabetical' ? 1 : -1 })
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const searchByEmail = await this.userModel.find({
          email_address: new RegExp(`${query.email}`, 'i'),
          isAuthenticated: true,
          user_type:'user',
        });
        return searchByEmail;
      }

      const searchByName = await this.userModel.find(
        query.searchBy == 'first_name'
          ? {
              first_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: true,
              user_type: 'user',
            }
          : {
              last_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: true,
              user_type: 'user',
            },
      );

      return searchByName;
    }

    const users = await this.userModel
      .find({
        isAuthenticated: true,
        user_type: 'user',
      })
      .sort({ createdAt: -1 })
      .limit(responsePerPage)
      .skip(skip);

    return users;
  }


  async getFisherfolkPendingUsers(query: Query): Promise<User[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    if (query.search) {
      if (query.searchBy != 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find(
              query.searchBy == 'first_name'
                ? {
                    first_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: false,
                    user_type: 'user',
                  }
                : {
                    last_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: false,
                    user_type: 'user',
                  },
            )
            .sort(
              query.sort == 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: 1 }
                : query.sort != 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: -1 }
                : query.sort == 'alphabetical' && query.searchBy == 'last_name'
                ? { last_name: 1 }
                : { last_name: -1 },
            )
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const alphabetical = this.userModel
          .find(
            query.searchBy == 'first_name'
              ? {
                  first_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: false,
                  user_type: 'user',
                }
              : {
                  last_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: false,
                  user_type: 'user',
                },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);

        return alphabetical;
      } else if (query.searchBy == 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find({
              email_address: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: 'user',
            })
            .sort({ email_address: query.sort == 'alphabetical' ? 1 : -1 })
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const searchByEmail = await this.userModel.find({
          email_address: new RegExp(`${query.email}`, 'i'),
          isAuthenticated: false,
          user_type:'user',
        });
        return searchByEmail;
      }

      const searchByName = await this.userModel.find(
        query.searchBy == 'first_name'
          ? {
              first_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: 'user',
            }
          : {
              last_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: 'user',
            },
      );

      return searchByName;
    }

    const users = await this.userModel
      .find({
        isAuthenticated: false,
        user_type: 'user',
      })
      .sort({ createdAt: -1 })
      .limit(responsePerPage)
      .skip(skip);

    return users;
  }


  async getFisherfolkRejectedUsers(query: Query): Promise<User[]> {
    const responsePerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = responsePerPage * (currentPage - 1);

    if (query.search) {
      if (query.searchBy != 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find(
              query.searchBy == 'first_name'
                ? {
                    first_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: false,
                    user_type: 'user-rejected',
                  }
                : {
                    last_name: new RegExp(`${query.search}`, 'i'),
                    isAuthenticated: false,
                    user_type: 'user-rejected',
                  },
            )
            .sort(
              query.sort == 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: 1 }
                : query.sort != 'alphabetical' && query.searchBy == 'first_name'
                ? { first_name: -1 }
                : query.sort == 'alphabetical' && query.searchBy == 'last_name'
                ? { last_name: 1 }
                : { last_name: -1 },
            )
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const alphabetical = this.userModel
          .find(
            query.searchBy == 'first_name'
              ? {
                  first_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: false,
                  user_type: 'user-rejected',
                }
              : {
                  last_name: new RegExp(`${query.search}`, 'i'),
                  isAuthenticated: false,
                  user_type: 'user-rejected',
                },
          )
          .collation({ locale: 'en', caseLevel: true })
          .limit(responsePerPage)
          .skip(skip);

        return alphabetical;
      } else if (query.searchBy == 'email') {
        if (query.sort) {
          const alphabetical = this.userModel
            .find({
              email_address: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: 'user-rejected',
            })
            .sort({ email_address: query.sort == 'alphabetical' ? 1 : -1 })
            .collation({ locale: 'en', caseLevel: true })
            .limit(responsePerPage)
            .skip(skip);

          return alphabetical;
        }

        const searchByEmail = await this.userModel.find({
          email_address: new RegExp(`${query.email}`, 'i'),
          isAuthenticated: false,
          user_type:'user-rejected',
        });
        return searchByEmail;
      }

      const searchByName = await this.userModel.find(
        query.searchBy == 'first_name'
          ? {
              first_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: 'user-rejected',
            }
          : {
              last_name: new RegExp(`${query.search}`, 'i'),
              isAuthenticated: false,
              user_type: 'user-rejected',
            },
      );

      return searchByName;
    }

    const users = await this.userModel
      .find({
        isAuthenticated: false,
        user_type: 'user-rejected',
      })
      .sort({ createdAt: -1 })
      .limit(responsePerPage)
      .skip(skip);

    return users;
  }


  async getUser(id: ObjectId): Promise<User> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    // const {password, ...user2} = user;

    return user;
  }

  async updateUser(id: ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true,
    });
  }

  async removeUser(id: ObjectId): Promise<User> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter valid ID.');
    }

    return await this.userModel.findByIdAndRemove(id);
  }
}
