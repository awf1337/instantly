import knex from 'knex';
import knexfile from '../../knexfile.js';

const db = knex(knexfile.development);

class DB {
  static async createEmail(emailData) {
    return db('emails').insert({
      ...emailData,
      userFK: 'fastUser' // hardcoded user
    });
  }

  static async getEmails() {
    return db('emails')
      .select('*')
      .orderBy('created_at', 'desc');
  }

  static async getEmailById(id) {
    return db('emails')
      .select('*')
      .where('id', id)
      .first();
  }

  static async getEmailsByUser(userFK = 'fastUser') {
    return db('emails')
      .select('*')
      .where('userFK', userFK)
      .orderBy('created_at', 'desc');
  }
}

export default DB;
