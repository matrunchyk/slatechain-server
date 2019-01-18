import BaseModel from './BaseModel';

const regDateOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
};

const regTimeOptions = {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
};

export default class Transaction extends BaseModel {
  // noinspection JSMethodCanBeStatic
  get defaults() {
    return {
      _id: '',
      date: null,
      amount: null,
      sender: {},
      recipient: {},
    };
  }

  get isIncoming() {
    return this.direction === 'INCOMING';
  }

  get isOutgoing() {
    return this.direction === 'OUTGOING';
  }

  get verbText() {
    if (this.direction === 'INCOMING') {
      return 'Received from';
    }
    if (this.direction === 'OUTGOING') {
      return 'Sent to';
    }
    // TODO: Improve and add support of statuses:
    //  Pending
    //  Declined
  }

  get longDate() {
    return new Intl.DateTimeFormat(
      'en-US',
      Object.assign(regDateOptions, regTimeOptions)
    ).format(this.date);
  }

  get shortDate() {
    return new Intl.DateTimeFormat(
      'en-US',
      Object.assign(regDateOptions)
    ).format(this.date);
  }
}
