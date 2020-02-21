import gql from 'graphql-tag'
const throng = require('throng');
import { client as GraphQLAPI } from './graphql'

export const subscribeFormEntries = () => {
  const formEntriesQuery = gql`
    subscription pipeline_form_entries {
      form_entries {
        id,
        fields,
        cached_community_id,
        activist_id,
        widget_id,
        created_at
      }
    }
  `

  return GraphQLAPI.subscribe({ query: formEntriesQuery })
}
/**
 * Some predefined delays (in milliseconds).
 */
export enum Delays {
  Short = 500,
  Medium = 2000,
  Long = 5000,
}

/**
 * Returns a Promise<string> that resolves after given time.
 *
 * @param {string} name - A name.
 * @param {number=} [delay=Delays.Medium] - Number of milliseconds to delay resolution of the Promise.
 * @returns {Promise<string>}
 */
function delayedHello(
  name: string,
  delay: number = Delays.Medium,
): Promise<string> {
  return new Promise((resolve: (value?: string) => void) =>
    setTimeout(() => resolve(`Hello, ${name}`), delay),
  );
}

// Below are examples of using ESLint errors suppression
// Here it is suppressing missing return type definitions for greeter function

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function greeter(name: string) {
  return await delayedHello(name, Delays.Short);
}

throng(async (id) => {
  console.log(`Started worker ${id}`);

  console.log(await subscribeFormEntries().subscribe((v) => console.log(v)));

  console.log(await greeter('my name'));

  process.on('SIGTERM', function() {
    console.log(`Worker ${id} exiting`);
    console.log('Cleanup here');
    process.exit();
  });
});