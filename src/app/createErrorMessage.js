/* @flow */

type issueObject = {
  error: number,
  warning: number,
  notice: number
}

const CreateErrorMessage = (issueCount: issueObject): string => {
  let errorString = issueCount.error > 1 ? 'errors' : 'error';
  return `There was ${issueCount.error} ${errorString}`;
};

export { CreateErrorMessage as default };
