import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    return this.repository.findOneOrFail(user_id, {
      relations: ['games']
    })
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`
      SELECT * FROM users 
      ORDER BY users.first_name ASC
    `); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
      SELECT DISTINCT * FROM users
      where UPPER(users.first_name) LIKE UPPER($1) 
      AND UPPER(users.last_name) LIKE UPPER($2) 
    `, [first_name, last_name]); // Complete usando raw query
  }
}
