import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`Inserted a User with id:${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User with id:${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Deleted User with id:${this.id}`);
  }
}
