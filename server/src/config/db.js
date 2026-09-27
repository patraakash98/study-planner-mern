import mongoose from 'mongoose';

export function connectDatabase(uri) {
  return mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
}

export function isDatabaseError(error) {
  return ['MongoNetworkError', 'MongoServerSelectionError', 'MongoNotConnectedError'].includes(error?.name)
    || error?.message?.includes('buffering timed out');
}
