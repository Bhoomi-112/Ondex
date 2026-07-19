
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ContractEvent
 * 
 */
export type ContractEvent = $Result.DefaultSelection<Prisma.$ContractEventPayload>
/**
 * Model Campaign
 * 
 */
export type Campaign = $Result.DefaultSelection<Prisma.$CampaignPayload>
/**
 * Model JuryCase
 * 
 */
export type JuryCase = $Result.DefaultSelection<Prisma.$JuryCasePayload>
/**
 * Model CaseJuror
 * 
 */
export type CaseJuror = $Result.DefaultSelection<Prisma.$CaseJurorPayload>
/**
 * Model CaseVote
 * 
 */
export type CaseVote = $Result.DefaultSelection<Prisma.$CaseVotePayload>
/**
 * Model Juror
 * 
 */
export type Juror = $Result.DefaultSelection<Prisma.$JurorPayload>
/**
 * Model Identity
 * 
 */
export type Identity = $Result.DefaultSelection<Prisma.$IdentityPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model IndexerCursor
 * 
 */
export type IndexerCursor = $Result.DefaultSelection<Prisma.$IndexerCursorPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more ContractEvents
 * const contractEvents = await prisma.contractEvent.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more ContractEvents
   * const contractEvents = await prisma.contractEvent.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.contractEvent`: Exposes CRUD operations for the **ContractEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContractEvents
    * const contractEvents = await prisma.contractEvent.findMany()
    * ```
    */
  get contractEvent(): Prisma.ContractEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.campaign`: Exposes CRUD operations for the **Campaign** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Campaigns
    * const campaigns = await prisma.campaign.findMany()
    * ```
    */
  get campaign(): Prisma.CampaignDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.juryCase`: Exposes CRUD operations for the **JuryCase** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JuryCases
    * const juryCases = await prisma.juryCase.findMany()
    * ```
    */
  get juryCase(): Prisma.JuryCaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.caseJuror`: Exposes CRUD operations for the **CaseJuror** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CaseJurors
    * const caseJurors = await prisma.caseJuror.findMany()
    * ```
    */
  get caseJuror(): Prisma.CaseJurorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.caseVote`: Exposes CRUD operations for the **CaseVote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CaseVotes
    * const caseVotes = await prisma.caseVote.findMany()
    * ```
    */
  get caseVote(): Prisma.CaseVoteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.juror`: Exposes CRUD operations for the **Juror** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jurors
    * const jurors = await prisma.juror.findMany()
    * ```
    */
  get juror(): Prisma.JurorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.identity`: Exposes CRUD operations for the **Identity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Identities
    * const identities = await prisma.identity.findMany()
    * ```
    */
  get identity(): Prisma.IdentityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.indexerCursor`: Exposes CRUD operations for the **IndexerCursor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IndexerCursors
    * const indexerCursors = await prisma.indexerCursor.findMany()
    * ```
    */
  get indexerCursor(): Prisma.IndexerCursorDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ContractEvent: 'ContractEvent',
    Campaign: 'Campaign',
    JuryCase: 'JuryCase',
    CaseJuror: 'CaseJuror',
    CaseVote: 'CaseVote',
    Juror: 'Juror',
    Identity: 'Identity',
    Session: 'Session',
    Notification: 'Notification',
    IndexerCursor: 'IndexerCursor'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "contractEvent" | "campaign" | "juryCase" | "caseJuror" | "caseVote" | "juror" | "identity" | "session" | "notification" | "indexerCursor"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ContractEvent: {
        payload: Prisma.$ContractEventPayload<ExtArgs>
        fields: Prisma.ContractEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContractEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContractEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload>
          }
          findFirst: {
            args: Prisma.ContractEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContractEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload>
          }
          findMany: {
            args: Prisma.ContractEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload>[]
          }
          create: {
            args: Prisma.ContractEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload>
          }
          createMany: {
            args: Prisma.ContractEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContractEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload>[]
          }
          delete: {
            args: Prisma.ContractEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload>
          }
          update: {
            args: Prisma.ContractEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload>
          }
          deleteMany: {
            args: Prisma.ContractEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContractEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContractEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload>[]
          }
          upsert: {
            args: Prisma.ContractEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContractEventPayload>
          }
          aggregate: {
            args: Prisma.ContractEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContractEvent>
          }
          groupBy: {
            args: Prisma.ContractEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContractEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContractEventCountArgs<ExtArgs>
            result: $Utils.Optional<ContractEventCountAggregateOutputType> | number
          }
        }
      }
      Campaign: {
        payload: Prisma.$CampaignPayload<ExtArgs>
        fields: Prisma.CampaignFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CampaignFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CampaignFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          findFirst: {
            args: Prisma.CampaignFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CampaignFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          findMany: {
            args: Prisma.CampaignFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          create: {
            args: Prisma.CampaignCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          createMany: {
            args: Prisma.CampaignCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CampaignCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          delete: {
            args: Prisma.CampaignDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          update: {
            args: Prisma.CampaignUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          deleteMany: {
            args: Prisma.CampaignDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CampaignUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CampaignUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          upsert: {
            args: Prisma.CampaignUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          aggregate: {
            args: Prisma.CampaignAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCampaign>
          }
          groupBy: {
            args: Prisma.CampaignGroupByArgs<ExtArgs>
            result: $Utils.Optional<CampaignGroupByOutputType>[]
          }
          count: {
            args: Prisma.CampaignCountArgs<ExtArgs>
            result: $Utils.Optional<CampaignCountAggregateOutputType> | number
          }
        }
      }
      JuryCase: {
        payload: Prisma.$JuryCasePayload<ExtArgs>
        fields: Prisma.JuryCaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JuryCaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JuryCaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload>
          }
          findFirst: {
            args: Prisma.JuryCaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JuryCaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload>
          }
          findMany: {
            args: Prisma.JuryCaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload>[]
          }
          create: {
            args: Prisma.JuryCaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload>
          }
          createMany: {
            args: Prisma.JuryCaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JuryCaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload>[]
          }
          delete: {
            args: Prisma.JuryCaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload>
          }
          update: {
            args: Prisma.JuryCaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload>
          }
          deleteMany: {
            args: Prisma.JuryCaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JuryCaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JuryCaseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload>[]
          }
          upsert: {
            args: Prisma.JuryCaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JuryCasePayload>
          }
          aggregate: {
            args: Prisma.JuryCaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJuryCase>
          }
          groupBy: {
            args: Prisma.JuryCaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<JuryCaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.JuryCaseCountArgs<ExtArgs>
            result: $Utils.Optional<JuryCaseCountAggregateOutputType> | number
          }
        }
      }
      CaseJuror: {
        payload: Prisma.$CaseJurorPayload<ExtArgs>
        fields: Prisma.CaseJurorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseJurorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseJurorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload>
          }
          findFirst: {
            args: Prisma.CaseJurorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseJurorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload>
          }
          findMany: {
            args: Prisma.CaseJurorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload>[]
          }
          create: {
            args: Prisma.CaseJurorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload>
          }
          createMany: {
            args: Prisma.CaseJurorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CaseJurorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload>[]
          }
          delete: {
            args: Prisma.CaseJurorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload>
          }
          update: {
            args: Prisma.CaseJurorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload>
          }
          deleteMany: {
            args: Prisma.CaseJurorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseJurorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CaseJurorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload>[]
          }
          upsert: {
            args: Prisma.CaseJurorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseJurorPayload>
          }
          aggregate: {
            args: Prisma.CaseJurorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCaseJuror>
          }
          groupBy: {
            args: Prisma.CaseJurorGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseJurorGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseJurorCountArgs<ExtArgs>
            result: $Utils.Optional<CaseJurorCountAggregateOutputType> | number
          }
        }
      }
      CaseVote: {
        payload: Prisma.$CaseVotePayload<ExtArgs>
        fields: Prisma.CaseVoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CaseVoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CaseVoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload>
          }
          findFirst: {
            args: Prisma.CaseVoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CaseVoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload>
          }
          findMany: {
            args: Prisma.CaseVoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload>[]
          }
          create: {
            args: Prisma.CaseVoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload>
          }
          createMany: {
            args: Prisma.CaseVoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CaseVoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload>[]
          }
          delete: {
            args: Prisma.CaseVoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload>
          }
          update: {
            args: Prisma.CaseVoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload>
          }
          deleteMany: {
            args: Prisma.CaseVoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CaseVoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CaseVoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload>[]
          }
          upsert: {
            args: Prisma.CaseVoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CaseVotePayload>
          }
          aggregate: {
            args: Prisma.CaseVoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCaseVote>
          }
          groupBy: {
            args: Prisma.CaseVoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<CaseVoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.CaseVoteCountArgs<ExtArgs>
            result: $Utils.Optional<CaseVoteCountAggregateOutputType> | number
          }
        }
      }
      Juror: {
        payload: Prisma.$JurorPayload<ExtArgs>
        fields: Prisma.JurorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JurorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JurorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload>
          }
          findFirst: {
            args: Prisma.JurorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JurorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload>
          }
          findMany: {
            args: Prisma.JurorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload>[]
          }
          create: {
            args: Prisma.JurorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload>
          }
          createMany: {
            args: Prisma.JurorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JurorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload>[]
          }
          delete: {
            args: Prisma.JurorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload>
          }
          update: {
            args: Prisma.JurorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload>
          }
          deleteMany: {
            args: Prisma.JurorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JurorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JurorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload>[]
          }
          upsert: {
            args: Prisma.JurorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurorPayload>
          }
          aggregate: {
            args: Prisma.JurorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJuror>
          }
          groupBy: {
            args: Prisma.JurorGroupByArgs<ExtArgs>
            result: $Utils.Optional<JurorGroupByOutputType>[]
          }
          count: {
            args: Prisma.JurorCountArgs<ExtArgs>
            result: $Utils.Optional<JurorCountAggregateOutputType> | number
          }
        }
      }
      Identity: {
        payload: Prisma.$IdentityPayload<ExtArgs>
        fields: Prisma.IdentityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IdentityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IdentityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload>
          }
          findFirst: {
            args: Prisma.IdentityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IdentityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload>
          }
          findMany: {
            args: Prisma.IdentityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload>[]
          }
          create: {
            args: Prisma.IdentityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload>
          }
          createMany: {
            args: Prisma.IdentityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IdentityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload>[]
          }
          delete: {
            args: Prisma.IdentityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload>
          }
          update: {
            args: Prisma.IdentityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload>
          }
          deleteMany: {
            args: Prisma.IdentityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IdentityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IdentityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload>[]
          }
          upsert: {
            args: Prisma.IdentityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityPayload>
          }
          aggregate: {
            args: Prisma.IdentityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIdentity>
          }
          groupBy: {
            args: Prisma.IdentityGroupByArgs<ExtArgs>
            result: $Utils.Optional<IdentityGroupByOutputType>[]
          }
          count: {
            args: Prisma.IdentityCountArgs<ExtArgs>
            result: $Utils.Optional<IdentityCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      IndexerCursor: {
        payload: Prisma.$IndexerCursorPayload<ExtArgs>
        fields: Prisma.IndexerCursorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IndexerCursorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IndexerCursorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload>
          }
          findFirst: {
            args: Prisma.IndexerCursorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IndexerCursorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload>
          }
          findMany: {
            args: Prisma.IndexerCursorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload>[]
          }
          create: {
            args: Prisma.IndexerCursorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload>
          }
          createMany: {
            args: Prisma.IndexerCursorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IndexerCursorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload>[]
          }
          delete: {
            args: Prisma.IndexerCursorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload>
          }
          update: {
            args: Prisma.IndexerCursorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload>
          }
          deleteMany: {
            args: Prisma.IndexerCursorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IndexerCursorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IndexerCursorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload>[]
          }
          upsert: {
            args: Prisma.IndexerCursorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexerCursorPayload>
          }
          aggregate: {
            args: Prisma.IndexerCursorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIndexerCursor>
          }
          groupBy: {
            args: Prisma.IndexerCursorGroupByArgs<ExtArgs>
            result: $Utils.Optional<IndexerCursorGroupByOutputType>[]
          }
          count: {
            args: Prisma.IndexerCursorCountArgs<ExtArgs>
            result: $Utils.Optional<IndexerCursorCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    contractEvent?: ContractEventOmit
    campaign?: CampaignOmit
    juryCase?: JuryCaseOmit
    caseJuror?: CaseJurorOmit
    caseVote?: CaseVoteOmit
    juror?: JurorOmit
    identity?: IdentityOmit
    session?: SessionOmit
    notification?: NotificationOmit
    indexerCursor?: IndexerCursorOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type JuryCaseCountOutputType
   */

  export type JuryCaseCountOutputType = {
    jurors: number
    votes: number
  }

  export type JuryCaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jurors?: boolean | JuryCaseCountOutputTypeCountJurorsArgs
    votes?: boolean | JuryCaseCountOutputTypeCountVotesArgs
  }

  // Custom InputTypes
  /**
   * JuryCaseCountOutputType without action
   */
  export type JuryCaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCaseCountOutputType
     */
    select?: JuryCaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JuryCaseCountOutputType without action
   */
  export type JuryCaseCountOutputTypeCountJurorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseJurorWhereInput
  }

  /**
   * JuryCaseCountOutputType without action
   */
  export type JuryCaseCountOutputTypeCountVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseVoteWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ContractEvent
   */

  export type AggregateContractEvent = {
    _count: ContractEventCountAggregateOutputType | null
    _avg: ContractEventAvgAggregateOutputType | null
    _sum: ContractEventSumAggregateOutputType | null
    _min: ContractEventMinAggregateOutputType | null
    _max: ContractEventMaxAggregateOutputType | null
  }

  export type ContractEventAvgAggregateOutputType = {
    ledgerSeq: number | null
  }

  export type ContractEventSumAggregateOutputType = {
    ledgerSeq: number | null
  }

  export type ContractEventMinAggregateOutputType = {
    id: string | null
    contractId: string | null
    contractType: string | null
    eventName: string | null
    ledgerSeq: number | null
    ledgerCloseAt: Date | null
    txHash: string | null
    topicXdr: string | null
    dataXdr: string | null
    processed: boolean | null
    createdAt: Date | null
  }

  export type ContractEventMaxAggregateOutputType = {
    id: string | null
    contractId: string | null
    contractType: string | null
    eventName: string | null
    ledgerSeq: number | null
    ledgerCloseAt: Date | null
    txHash: string | null
    topicXdr: string | null
    dataXdr: string | null
    processed: boolean | null
    createdAt: Date | null
  }

  export type ContractEventCountAggregateOutputType = {
    id: number
    contractId: number
    contractType: number
    eventName: number
    ledgerSeq: number
    ledgerCloseAt: number
    txHash: number
    topicXdr: number
    dataXdr: number
    processed: number
    createdAt: number
    _all: number
  }


  export type ContractEventAvgAggregateInputType = {
    ledgerSeq?: true
  }

  export type ContractEventSumAggregateInputType = {
    ledgerSeq?: true
  }

  export type ContractEventMinAggregateInputType = {
    id?: true
    contractId?: true
    contractType?: true
    eventName?: true
    ledgerSeq?: true
    ledgerCloseAt?: true
    txHash?: true
    topicXdr?: true
    dataXdr?: true
    processed?: true
    createdAt?: true
  }

  export type ContractEventMaxAggregateInputType = {
    id?: true
    contractId?: true
    contractType?: true
    eventName?: true
    ledgerSeq?: true
    ledgerCloseAt?: true
    txHash?: true
    topicXdr?: true
    dataXdr?: true
    processed?: true
    createdAt?: true
  }

  export type ContractEventCountAggregateInputType = {
    id?: true
    contractId?: true
    contractType?: true
    eventName?: true
    ledgerSeq?: true
    ledgerCloseAt?: true
    txHash?: true
    topicXdr?: true
    dataXdr?: true
    processed?: true
    createdAt?: true
    _all?: true
  }

  export type ContractEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContractEvent to aggregate.
     */
    where?: ContractEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContractEvents to fetch.
     */
    orderBy?: ContractEventOrderByWithRelationInput | ContractEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContractEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContractEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContractEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContractEvents
    **/
    _count?: true | ContractEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContractEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContractEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContractEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContractEventMaxAggregateInputType
  }

  export type GetContractEventAggregateType<T extends ContractEventAggregateArgs> = {
        [P in keyof T & keyof AggregateContractEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContractEvent[P]>
      : GetScalarType<T[P], AggregateContractEvent[P]>
  }




  export type ContractEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContractEventWhereInput
    orderBy?: ContractEventOrderByWithAggregationInput | ContractEventOrderByWithAggregationInput[]
    by: ContractEventScalarFieldEnum[] | ContractEventScalarFieldEnum
    having?: ContractEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContractEventCountAggregateInputType | true
    _avg?: ContractEventAvgAggregateInputType
    _sum?: ContractEventSumAggregateInputType
    _min?: ContractEventMinAggregateInputType
    _max?: ContractEventMaxAggregateInputType
  }

  export type ContractEventGroupByOutputType = {
    id: string
    contractId: string
    contractType: string
    eventName: string
    ledgerSeq: number
    ledgerCloseAt: Date
    txHash: string
    topicXdr: string
    dataXdr: string
    processed: boolean
    createdAt: Date
    _count: ContractEventCountAggregateOutputType | null
    _avg: ContractEventAvgAggregateOutputType | null
    _sum: ContractEventSumAggregateOutputType | null
    _min: ContractEventMinAggregateOutputType | null
    _max: ContractEventMaxAggregateOutputType | null
  }

  type GetContractEventGroupByPayload<T extends ContractEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContractEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContractEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContractEventGroupByOutputType[P]>
            : GetScalarType<T[P], ContractEventGroupByOutputType[P]>
        }
      >
    >


  export type ContractEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contractId?: boolean
    contractType?: boolean
    eventName?: boolean
    ledgerSeq?: boolean
    ledgerCloseAt?: boolean
    txHash?: boolean
    topicXdr?: boolean
    dataXdr?: boolean
    processed?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["contractEvent"]>

  export type ContractEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contractId?: boolean
    contractType?: boolean
    eventName?: boolean
    ledgerSeq?: boolean
    ledgerCloseAt?: boolean
    txHash?: boolean
    topicXdr?: boolean
    dataXdr?: boolean
    processed?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["contractEvent"]>

  export type ContractEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contractId?: boolean
    contractType?: boolean
    eventName?: boolean
    ledgerSeq?: boolean
    ledgerCloseAt?: boolean
    txHash?: boolean
    topicXdr?: boolean
    dataXdr?: boolean
    processed?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["contractEvent"]>

  export type ContractEventSelectScalar = {
    id?: boolean
    contractId?: boolean
    contractType?: boolean
    eventName?: boolean
    ledgerSeq?: boolean
    ledgerCloseAt?: boolean
    txHash?: boolean
    topicXdr?: boolean
    dataXdr?: boolean
    processed?: boolean
    createdAt?: boolean
  }

  export type ContractEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "contractId" | "contractType" | "eventName" | "ledgerSeq" | "ledgerCloseAt" | "txHash" | "topicXdr" | "dataXdr" | "processed" | "createdAt", ExtArgs["result"]["contractEvent"]>

  export type $ContractEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContractEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      contractId: string
      contractType: string
      eventName: string
      ledgerSeq: number
      ledgerCloseAt: Date
      txHash: string
      topicXdr: string
      dataXdr: string
      processed: boolean
      createdAt: Date
    }, ExtArgs["result"]["contractEvent"]>
    composites: {}
  }

  type ContractEventGetPayload<S extends boolean | null | undefined | ContractEventDefaultArgs> = $Result.GetResult<Prisma.$ContractEventPayload, S>

  type ContractEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContractEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContractEventCountAggregateInputType | true
    }

  export interface ContractEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContractEvent'], meta: { name: 'ContractEvent' } }
    /**
     * Find zero or one ContractEvent that matches the filter.
     * @param {ContractEventFindUniqueArgs} args - Arguments to find a ContractEvent
     * @example
     * // Get one ContractEvent
     * const contractEvent = await prisma.contractEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContractEventFindUniqueArgs>(args: SelectSubset<T, ContractEventFindUniqueArgs<ExtArgs>>): Prisma__ContractEventClient<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContractEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContractEventFindUniqueOrThrowArgs} args - Arguments to find a ContractEvent
     * @example
     * // Get one ContractEvent
     * const contractEvent = await prisma.contractEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContractEventFindUniqueOrThrowArgs>(args: SelectSubset<T, ContractEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContractEventClient<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContractEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContractEventFindFirstArgs} args - Arguments to find a ContractEvent
     * @example
     * // Get one ContractEvent
     * const contractEvent = await prisma.contractEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContractEventFindFirstArgs>(args?: SelectSubset<T, ContractEventFindFirstArgs<ExtArgs>>): Prisma__ContractEventClient<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContractEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContractEventFindFirstOrThrowArgs} args - Arguments to find a ContractEvent
     * @example
     * // Get one ContractEvent
     * const contractEvent = await prisma.contractEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContractEventFindFirstOrThrowArgs>(args?: SelectSubset<T, ContractEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContractEventClient<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContractEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContractEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContractEvents
     * const contractEvents = await prisma.contractEvent.findMany()
     * 
     * // Get first 10 ContractEvents
     * const contractEvents = await prisma.contractEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contractEventWithIdOnly = await prisma.contractEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContractEventFindManyArgs>(args?: SelectSubset<T, ContractEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContractEvent.
     * @param {ContractEventCreateArgs} args - Arguments to create a ContractEvent.
     * @example
     * // Create one ContractEvent
     * const ContractEvent = await prisma.contractEvent.create({
     *   data: {
     *     // ... data to create a ContractEvent
     *   }
     * })
     * 
     */
    create<T extends ContractEventCreateArgs>(args: SelectSubset<T, ContractEventCreateArgs<ExtArgs>>): Prisma__ContractEventClient<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContractEvents.
     * @param {ContractEventCreateManyArgs} args - Arguments to create many ContractEvents.
     * @example
     * // Create many ContractEvents
     * const contractEvent = await prisma.contractEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContractEventCreateManyArgs>(args?: SelectSubset<T, ContractEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContractEvents and returns the data saved in the database.
     * @param {ContractEventCreateManyAndReturnArgs} args - Arguments to create many ContractEvents.
     * @example
     * // Create many ContractEvents
     * const contractEvent = await prisma.contractEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContractEvents and only return the `id`
     * const contractEventWithIdOnly = await prisma.contractEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContractEventCreateManyAndReturnArgs>(args?: SelectSubset<T, ContractEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContractEvent.
     * @param {ContractEventDeleteArgs} args - Arguments to delete one ContractEvent.
     * @example
     * // Delete one ContractEvent
     * const ContractEvent = await prisma.contractEvent.delete({
     *   where: {
     *     // ... filter to delete one ContractEvent
     *   }
     * })
     * 
     */
    delete<T extends ContractEventDeleteArgs>(args: SelectSubset<T, ContractEventDeleteArgs<ExtArgs>>): Prisma__ContractEventClient<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContractEvent.
     * @param {ContractEventUpdateArgs} args - Arguments to update one ContractEvent.
     * @example
     * // Update one ContractEvent
     * const contractEvent = await prisma.contractEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContractEventUpdateArgs>(args: SelectSubset<T, ContractEventUpdateArgs<ExtArgs>>): Prisma__ContractEventClient<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContractEvents.
     * @param {ContractEventDeleteManyArgs} args - Arguments to filter ContractEvents to delete.
     * @example
     * // Delete a few ContractEvents
     * const { count } = await prisma.contractEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContractEventDeleteManyArgs>(args?: SelectSubset<T, ContractEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContractEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContractEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContractEvents
     * const contractEvent = await prisma.contractEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContractEventUpdateManyArgs>(args: SelectSubset<T, ContractEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContractEvents and returns the data updated in the database.
     * @param {ContractEventUpdateManyAndReturnArgs} args - Arguments to update many ContractEvents.
     * @example
     * // Update many ContractEvents
     * const contractEvent = await prisma.contractEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContractEvents and only return the `id`
     * const contractEventWithIdOnly = await prisma.contractEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContractEventUpdateManyAndReturnArgs>(args: SelectSubset<T, ContractEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContractEvent.
     * @param {ContractEventUpsertArgs} args - Arguments to update or create a ContractEvent.
     * @example
     * // Update or create a ContractEvent
     * const contractEvent = await prisma.contractEvent.upsert({
     *   create: {
     *     // ... data to create a ContractEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContractEvent we want to update
     *   }
     * })
     */
    upsert<T extends ContractEventUpsertArgs>(args: SelectSubset<T, ContractEventUpsertArgs<ExtArgs>>): Prisma__ContractEventClient<$Result.GetResult<Prisma.$ContractEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContractEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContractEventCountArgs} args - Arguments to filter ContractEvents to count.
     * @example
     * // Count the number of ContractEvents
     * const count = await prisma.contractEvent.count({
     *   where: {
     *     // ... the filter for the ContractEvents we want to count
     *   }
     * })
    **/
    count<T extends ContractEventCountArgs>(
      args?: Subset<T, ContractEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContractEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContractEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContractEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContractEventAggregateArgs>(args: Subset<T, ContractEventAggregateArgs>): Prisma.PrismaPromise<GetContractEventAggregateType<T>>

    /**
     * Group by ContractEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContractEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContractEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContractEventGroupByArgs['orderBy'] }
        : { orderBy?: ContractEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContractEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContractEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContractEvent model
   */
  readonly fields: ContractEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContractEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContractEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContractEvent model
   */
  interface ContractEventFieldRefs {
    readonly id: FieldRef<"ContractEvent", 'String'>
    readonly contractId: FieldRef<"ContractEvent", 'String'>
    readonly contractType: FieldRef<"ContractEvent", 'String'>
    readonly eventName: FieldRef<"ContractEvent", 'String'>
    readonly ledgerSeq: FieldRef<"ContractEvent", 'Int'>
    readonly ledgerCloseAt: FieldRef<"ContractEvent", 'DateTime'>
    readonly txHash: FieldRef<"ContractEvent", 'String'>
    readonly topicXdr: FieldRef<"ContractEvent", 'String'>
    readonly dataXdr: FieldRef<"ContractEvent", 'String'>
    readonly processed: FieldRef<"ContractEvent", 'Boolean'>
    readonly createdAt: FieldRef<"ContractEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContractEvent findUnique
   */
  export type ContractEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * Filter, which ContractEvent to fetch.
     */
    where: ContractEventWhereUniqueInput
  }

  /**
   * ContractEvent findUniqueOrThrow
   */
  export type ContractEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * Filter, which ContractEvent to fetch.
     */
    where: ContractEventWhereUniqueInput
  }

  /**
   * ContractEvent findFirst
   */
  export type ContractEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * Filter, which ContractEvent to fetch.
     */
    where?: ContractEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContractEvents to fetch.
     */
    orderBy?: ContractEventOrderByWithRelationInput | ContractEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContractEvents.
     */
    cursor?: ContractEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContractEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContractEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContractEvents.
     */
    distinct?: ContractEventScalarFieldEnum | ContractEventScalarFieldEnum[]
  }

  /**
   * ContractEvent findFirstOrThrow
   */
  export type ContractEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * Filter, which ContractEvent to fetch.
     */
    where?: ContractEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContractEvents to fetch.
     */
    orderBy?: ContractEventOrderByWithRelationInput | ContractEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContractEvents.
     */
    cursor?: ContractEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContractEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContractEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContractEvents.
     */
    distinct?: ContractEventScalarFieldEnum | ContractEventScalarFieldEnum[]
  }

  /**
   * ContractEvent findMany
   */
  export type ContractEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * Filter, which ContractEvents to fetch.
     */
    where?: ContractEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContractEvents to fetch.
     */
    orderBy?: ContractEventOrderByWithRelationInput | ContractEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContractEvents.
     */
    cursor?: ContractEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContractEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContractEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContractEvents.
     */
    distinct?: ContractEventScalarFieldEnum | ContractEventScalarFieldEnum[]
  }

  /**
   * ContractEvent create
   */
  export type ContractEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * The data needed to create a ContractEvent.
     */
    data: XOR<ContractEventCreateInput, ContractEventUncheckedCreateInput>
  }

  /**
   * ContractEvent createMany
   */
  export type ContractEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContractEvents.
     */
    data: ContractEventCreateManyInput | ContractEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContractEvent createManyAndReturn
   */
  export type ContractEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * The data used to create many ContractEvents.
     */
    data: ContractEventCreateManyInput | ContractEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContractEvent update
   */
  export type ContractEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * The data needed to update a ContractEvent.
     */
    data: XOR<ContractEventUpdateInput, ContractEventUncheckedUpdateInput>
    /**
     * Choose, which ContractEvent to update.
     */
    where: ContractEventWhereUniqueInput
  }

  /**
   * ContractEvent updateMany
   */
  export type ContractEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContractEvents.
     */
    data: XOR<ContractEventUpdateManyMutationInput, ContractEventUncheckedUpdateManyInput>
    /**
     * Filter which ContractEvents to update
     */
    where?: ContractEventWhereInput
    /**
     * Limit how many ContractEvents to update.
     */
    limit?: number
  }

  /**
   * ContractEvent updateManyAndReturn
   */
  export type ContractEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * The data used to update ContractEvents.
     */
    data: XOR<ContractEventUpdateManyMutationInput, ContractEventUncheckedUpdateManyInput>
    /**
     * Filter which ContractEvents to update
     */
    where?: ContractEventWhereInput
    /**
     * Limit how many ContractEvents to update.
     */
    limit?: number
  }

  /**
   * ContractEvent upsert
   */
  export type ContractEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * The filter to search for the ContractEvent to update in case it exists.
     */
    where: ContractEventWhereUniqueInput
    /**
     * In case the ContractEvent found by the `where` argument doesn't exist, create a new ContractEvent with this data.
     */
    create: XOR<ContractEventCreateInput, ContractEventUncheckedCreateInput>
    /**
     * In case the ContractEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContractEventUpdateInput, ContractEventUncheckedUpdateInput>
  }

  /**
   * ContractEvent delete
   */
  export type ContractEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
    /**
     * Filter which ContractEvent to delete.
     */
    where: ContractEventWhereUniqueInput
  }

  /**
   * ContractEvent deleteMany
   */
  export type ContractEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContractEvents to delete
     */
    where?: ContractEventWhereInput
    /**
     * Limit how many ContractEvents to delete.
     */
    limit?: number
  }

  /**
   * ContractEvent without action
   */
  export type ContractEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContractEvent
     */
    select?: ContractEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContractEvent
     */
    omit?: ContractEventOmit<ExtArgs> | null
  }


  /**
   * Model Campaign
   */

  export type AggregateCampaign = {
    _count: CampaignCountAggregateOutputType | null
    _avg: CampaignAvgAggregateOutputType | null
    _sum: CampaignSumAggregateOutputType | null
    _min: CampaignMinAggregateOutputType | null
    _max: CampaignMaxAggregateOutputType | null
  }

  export type CampaignAvgAggregateOutputType = {
    id: number | null
    campaignId: number | null
    amount: number | null
  }

  export type CampaignSumAggregateOutputType = {
    id: number | null
    campaignId: number | null
    amount: bigint | null
  }

  export type CampaignMinAggregateOutputType = {
    id: number | null
    campaignId: number | null
    startupAddress: string | null
    investorAddress: string | null
    amount: bigint | null
    asset: string | null
    state: string | null
    createdAt: Date | null
    approvedAt: Date | null
    disputeDeadline: Date | null
    updatedAt: Date | null
  }

  export type CampaignMaxAggregateOutputType = {
    id: number | null
    campaignId: number | null
    startupAddress: string | null
    investorAddress: string | null
    amount: bigint | null
    asset: string | null
    state: string | null
    createdAt: Date | null
    approvedAt: Date | null
    disputeDeadline: Date | null
    updatedAt: Date | null
  }

  export type CampaignCountAggregateOutputType = {
    id: number
    campaignId: number
    startupAddress: number
    investorAddress: number
    amount: number
    asset: number
    state: number
    createdAt: number
    approvedAt: number
    disputeDeadline: number
    updatedAt: number
    _all: number
  }


  export type CampaignAvgAggregateInputType = {
    id?: true
    campaignId?: true
    amount?: true
  }

  export type CampaignSumAggregateInputType = {
    id?: true
    campaignId?: true
    amount?: true
  }

  export type CampaignMinAggregateInputType = {
    id?: true
    campaignId?: true
    startupAddress?: true
    investorAddress?: true
    amount?: true
    asset?: true
    state?: true
    createdAt?: true
    approvedAt?: true
    disputeDeadline?: true
    updatedAt?: true
  }

  export type CampaignMaxAggregateInputType = {
    id?: true
    campaignId?: true
    startupAddress?: true
    investorAddress?: true
    amount?: true
    asset?: true
    state?: true
    createdAt?: true
    approvedAt?: true
    disputeDeadline?: true
    updatedAt?: true
  }

  export type CampaignCountAggregateInputType = {
    id?: true
    campaignId?: true
    startupAddress?: true
    investorAddress?: true
    amount?: true
    asset?: true
    state?: true
    createdAt?: true
    approvedAt?: true
    disputeDeadline?: true
    updatedAt?: true
    _all?: true
  }

  export type CampaignAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Campaign to aggregate.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Campaigns
    **/
    _count?: true | CampaignCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CampaignAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CampaignSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CampaignMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CampaignMaxAggregateInputType
  }

  export type GetCampaignAggregateType<T extends CampaignAggregateArgs> = {
        [P in keyof T & keyof AggregateCampaign]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCampaign[P]>
      : GetScalarType<T[P], AggregateCampaign[P]>
  }




  export type CampaignGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignWhereInput
    orderBy?: CampaignOrderByWithAggregationInput | CampaignOrderByWithAggregationInput[]
    by: CampaignScalarFieldEnum[] | CampaignScalarFieldEnum
    having?: CampaignScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CampaignCountAggregateInputType | true
    _avg?: CampaignAvgAggregateInputType
    _sum?: CampaignSumAggregateInputType
    _min?: CampaignMinAggregateInputType
    _max?: CampaignMaxAggregateInputType
  }

  export type CampaignGroupByOutputType = {
    id: number
    campaignId: number
    startupAddress: string
    investorAddress: string
    amount: bigint
    asset: string
    state: string
    createdAt: Date
    approvedAt: Date | null
    disputeDeadline: Date | null
    updatedAt: Date
    _count: CampaignCountAggregateOutputType | null
    _avg: CampaignAvgAggregateOutputType | null
    _sum: CampaignSumAggregateOutputType | null
    _min: CampaignMinAggregateOutputType | null
    _max: CampaignMaxAggregateOutputType | null
  }

  type GetCampaignGroupByPayload<T extends CampaignGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CampaignGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CampaignGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CampaignGroupByOutputType[P]>
            : GetScalarType<T[P], CampaignGroupByOutputType[P]>
        }
      >
    >


  export type CampaignSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    startupAddress?: boolean
    investorAddress?: boolean
    amount?: boolean
    asset?: boolean
    state?: boolean
    createdAt?: boolean
    approvedAt?: boolean
    disputeDeadline?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    startupAddress?: boolean
    investorAddress?: boolean
    amount?: boolean
    asset?: boolean
    state?: boolean
    createdAt?: boolean
    approvedAt?: boolean
    disputeDeadline?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    startupAddress?: boolean
    investorAddress?: boolean
    amount?: boolean
    asset?: boolean
    state?: boolean
    createdAt?: boolean
    approvedAt?: boolean
    disputeDeadline?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectScalar = {
    id?: boolean
    campaignId?: boolean
    startupAddress?: boolean
    investorAddress?: boolean
    amount?: boolean
    asset?: boolean
    state?: boolean
    createdAt?: boolean
    approvedAt?: boolean
    disputeDeadline?: boolean
    updatedAt?: boolean
  }

  export type CampaignOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "campaignId" | "startupAddress" | "investorAddress" | "amount" | "asset" | "state" | "createdAt" | "approvedAt" | "disputeDeadline" | "updatedAt", ExtArgs["result"]["campaign"]>

  export type $CampaignPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Campaign"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      campaignId: number
      startupAddress: string
      investorAddress: string
      amount: bigint
      asset: string
      state: string
      createdAt: Date
      approvedAt: Date | null
      disputeDeadline: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["campaign"]>
    composites: {}
  }

  type CampaignGetPayload<S extends boolean | null | undefined | CampaignDefaultArgs> = $Result.GetResult<Prisma.$CampaignPayload, S>

  type CampaignCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CampaignFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CampaignCountAggregateInputType | true
    }

  export interface CampaignDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Campaign'], meta: { name: 'Campaign' } }
    /**
     * Find zero or one Campaign that matches the filter.
     * @param {CampaignFindUniqueArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CampaignFindUniqueArgs>(args: SelectSubset<T, CampaignFindUniqueArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Campaign that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CampaignFindUniqueOrThrowArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CampaignFindUniqueOrThrowArgs>(args: SelectSubset<T, CampaignFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Campaign that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindFirstArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CampaignFindFirstArgs>(args?: SelectSubset<T, CampaignFindFirstArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Campaign that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindFirstOrThrowArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CampaignFindFirstOrThrowArgs>(args?: SelectSubset<T, CampaignFindFirstOrThrowArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Campaigns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Campaigns
     * const campaigns = await prisma.campaign.findMany()
     * 
     * // Get first 10 Campaigns
     * const campaigns = await prisma.campaign.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const campaignWithIdOnly = await prisma.campaign.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CampaignFindManyArgs>(args?: SelectSubset<T, CampaignFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Campaign.
     * @param {CampaignCreateArgs} args - Arguments to create a Campaign.
     * @example
     * // Create one Campaign
     * const Campaign = await prisma.campaign.create({
     *   data: {
     *     // ... data to create a Campaign
     *   }
     * })
     * 
     */
    create<T extends CampaignCreateArgs>(args: SelectSubset<T, CampaignCreateArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Campaigns.
     * @param {CampaignCreateManyArgs} args - Arguments to create many Campaigns.
     * @example
     * // Create many Campaigns
     * const campaign = await prisma.campaign.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CampaignCreateManyArgs>(args?: SelectSubset<T, CampaignCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Campaigns and returns the data saved in the database.
     * @param {CampaignCreateManyAndReturnArgs} args - Arguments to create many Campaigns.
     * @example
     * // Create many Campaigns
     * const campaign = await prisma.campaign.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Campaigns and only return the `id`
     * const campaignWithIdOnly = await prisma.campaign.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CampaignCreateManyAndReturnArgs>(args?: SelectSubset<T, CampaignCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Campaign.
     * @param {CampaignDeleteArgs} args - Arguments to delete one Campaign.
     * @example
     * // Delete one Campaign
     * const Campaign = await prisma.campaign.delete({
     *   where: {
     *     // ... filter to delete one Campaign
     *   }
     * })
     * 
     */
    delete<T extends CampaignDeleteArgs>(args: SelectSubset<T, CampaignDeleteArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Campaign.
     * @param {CampaignUpdateArgs} args - Arguments to update one Campaign.
     * @example
     * // Update one Campaign
     * const campaign = await prisma.campaign.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CampaignUpdateArgs>(args: SelectSubset<T, CampaignUpdateArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Campaigns.
     * @param {CampaignDeleteManyArgs} args - Arguments to filter Campaigns to delete.
     * @example
     * // Delete a few Campaigns
     * const { count } = await prisma.campaign.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CampaignDeleteManyArgs>(args?: SelectSubset<T, CampaignDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Campaigns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Campaigns
     * const campaign = await prisma.campaign.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CampaignUpdateManyArgs>(args: SelectSubset<T, CampaignUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Campaigns and returns the data updated in the database.
     * @param {CampaignUpdateManyAndReturnArgs} args - Arguments to update many Campaigns.
     * @example
     * // Update many Campaigns
     * const campaign = await prisma.campaign.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Campaigns and only return the `id`
     * const campaignWithIdOnly = await prisma.campaign.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CampaignUpdateManyAndReturnArgs>(args: SelectSubset<T, CampaignUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Campaign.
     * @param {CampaignUpsertArgs} args - Arguments to update or create a Campaign.
     * @example
     * // Update or create a Campaign
     * const campaign = await prisma.campaign.upsert({
     *   create: {
     *     // ... data to create a Campaign
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Campaign we want to update
     *   }
     * })
     */
    upsert<T extends CampaignUpsertArgs>(args: SelectSubset<T, CampaignUpsertArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Campaigns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignCountArgs} args - Arguments to filter Campaigns to count.
     * @example
     * // Count the number of Campaigns
     * const count = await prisma.campaign.count({
     *   where: {
     *     // ... the filter for the Campaigns we want to count
     *   }
     * })
    **/
    count<T extends CampaignCountArgs>(
      args?: Subset<T, CampaignCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CampaignCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Campaign.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CampaignAggregateArgs>(args: Subset<T, CampaignAggregateArgs>): Prisma.PrismaPromise<GetCampaignAggregateType<T>>

    /**
     * Group by Campaign.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CampaignGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CampaignGroupByArgs['orderBy'] }
        : { orderBy?: CampaignGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CampaignGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCampaignGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Campaign model
   */
  readonly fields: CampaignFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Campaign.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CampaignClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Campaign model
   */
  interface CampaignFieldRefs {
    readonly id: FieldRef<"Campaign", 'Int'>
    readonly campaignId: FieldRef<"Campaign", 'Int'>
    readonly startupAddress: FieldRef<"Campaign", 'String'>
    readonly investorAddress: FieldRef<"Campaign", 'String'>
    readonly amount: FieldRef<"Campaign", 'BigInt'>
    readonly asset: FieldRef<"Campaign", 'String'>
    readonly state: FieldRef<"Campaign", 'String'>
    readonly createdAt: FieldRef<"Campaign", 'DateTime'>
    readonly approvedAt: FieldRef<"Campaign", 'DateTime'>
    readonly disputeDeadline: FieldRef<"Campaign", 'DateTime'>
    readonly updatedAt: FieldRef<"Campaign", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Campaign findUnique
   */
  export type CampaignFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign findUniqueOrThrow
   */
  export type CampaignFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign findFirst
   */
  export type CampaignFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Campaigns.
     */
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign findFirstOrThrow
   */
  export type CampaignFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Campaigns.
     */
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign findMany
   */
  export type CampaignFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Filter, which Campaigns to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Campaigns.
     */
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign create
   */
  export type CampaignCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * The data needed to create a Campaign.
     */
    data: XOR<CampaignCreateInput, CampaignUncheckedCreateInput>
  }

  /**
   * Campaign createMany
   */
  export type CampaignCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Campaigns.
     */
    data: CampaignCreateManyInput | CampaignCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Campaign createManyAndReturn
   */
  export type CampaignCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * The data used to create many Campaigns.
     */
    data: CampaignCreateManyInput | CampaignCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Campaign update
   */
  export type CampaignUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * The data needed to update a Campaign.
     */
    data: XOR<CampaignUpdateInput, CampaignUncheckedUpdateInput>
    /**
     * Choose, which Campaign to update.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign updateMany
   */
  export type CampaignUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Campaigns.
     */
    data: XOR<CampaignUpdateManyMutationInput, CampaignUncheckedUpdateManyInput>
    /**
     * Filter which Campaigns to update
     */
    where?: CampaignWhereInput
    /**
     * Limit how many Campaigns to update.
     */
    limit?: number
  }

  /**
   * Campaign updateManyAndReturn
   */
  export type CampaignUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * The data used to update Campaigns.
     */
    data: XOR<CampaignUpdateManyMutationInput, CampaignUncheckedUpdateManyInput>
    /**
     * Filter which Campaigns to update
     */
    where?: CampaignWhereInput
    /**
     * Limit how many Campaigns to update.
     */
    limit?: number
  }

  /**
   * Campaign upsert
   */
  export type CampaignUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * The filter to search for the Campaign to update in case it exists.
     */
    where: CampaignWhereUniqueInput
    /**
     * In case the Campaign found by the `where` argument doesn't exist, create a new Campaign with this data.
     */
    create: XOR<CampaignCreateInput, CampaignUncheckedCreateInput>
    /**
     * In case the Campaign was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CampaignUpdateInput, CampaignUncheckedUpdateInput>
  }

  /**
   * Campaign delete
   */
  export type CampaignDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Filter which Campaign to delete.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign deleteMany
   */
  export type CampaignDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Campaigns to delete
     */
    where?: CampaignWhereInput
    /**
     * Limit how many Campaigns to delete.
     */
    limit?: number
  }

  /**
   * Campaign without action
   */
  export type CampaignDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
  }


  /**
   * Model JuryCase
   */

  export type AggregateJuryCase = {
    _count: JuryCaseCountAggregateOutputType | null
    _avg: JuryCaseAvgAggregateOutputType | null
    _sum: JuryCaseSumAggregateOutputType | null
    _min: JuryCaseMinAggregateOutputType | null
    _max: JuryCaseMaxAggregateOutputType | null
  }

  export type JuryCaseAvgAggregateOutputType = {
    id: number | null
    caseId: number | null
    forVotes: number | null
    againstVotes: number | null
    totalVotes: number | null
  }

  export type JuryCaseSumAggregateOutputType = {
    id: number | null
    caseId: number | null
    forVotes: number | null
    againstVotes: number | null
    totalVotes: number | null
  }

  export type JuryCaseMinAggregateOutputType = {
    id: number | null
    caseId: number | null
    status: string | null
    forVotes: number | null
    againstVotes: number | null
    totalVotes: number | null
    resolvedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JuryCaseMaxAggregateOutputType = {
    id: number | null
    caseId: number | null
    status: string | null
    forVotes: number | null
    againstVotes: number | null
    totalVotes: number | null
    resolvedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JuryCaseCountAggregateOutputType = {
    id: number
    caseId: number
    status: number
    forVotes: number
    againstVotes: number
    totalVotes: number
    resolvedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type JuryCaseAvgAggregateInputType = {
    id?: true
    caseId?: true
    forVotes?: true
    againstVotes?: true
    totalVotes?: true
  }

  export type JuryCaseSumAggregateInputType = {
    id?: true
    caseId?: true
    forVotes?: true
    againstVotes?: true
    totalVotes?: true
  }

  export type JuryCaseMinAggregateInputType = {
    id?: true
    caseId?: true
    status?: true
    forVotes?: true
    againstVotes?: true
    totalVotes?: true
    resolvedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JuryCaseMaxAggregateInputType = {
    id?: true
    caseId?: true
    status?: true
    forVotes?: true
    againstVotes?: true
    totalVotes?: true
    resolvedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JuryCaseCountAggregateInputType = {
    id?: true
    caseId?: true
    status?: true
    forVotes?: true
    againstVotes?: true
    totalVotes?: true
    resolvedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type JuryCaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JuryCase to aggregate.
     */
    where?: JuryCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JuryCases to fetch.
     */
    orderBy?: JuryCaseOrderByWithRelationInput | JuryCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JuryCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JuryCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JuryCases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JuryCases
    **/
    _count?: true | JuryCaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JuryCaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JuryCaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JuryCaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JuryCaseMaxAggregateInputType
  }

  export type GetJuryCaseAggregateType<T extends JuryCaseAggregateArgs> = {
        [P in keyof T & keyof AggregateJuryCase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJuryCase[P]>
      : GetScalarType<T[P], AggregateJuryCase[P]>
  }




  export type JuryCaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JuryCaseWhereInput
    orderBy?: JuryCaseOrderByWithAggregationInput | JuryCaseOrderByWithAggregationInput[]
    by: JuryCaseScalarFieldEnum[] | JuryCaseScalarFieldEnum
    having?: JuryCaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JuryCaseCountAggregateInputType | true
    _avg?: JuryCaseAvgAggregateInputType
    _sum?: JuryCaseSumAggregateInputType
    _min?: JuryCaseMinAggregateInputType
    _max?: JuryCaseMaxAggregateInputType
  }

  export type JuryCaseGroupByOutputType = {
    id: number
    caseId: number
    status: string
    forVotes: number
    againstVotes: number
    totalVotes: number
    resolvedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: JuryCaseCountAggregateOutputType | null
    _avg: JuryCaseAvgAggregateOutputType | null
    _sum: JuryCaseSumAggregateOutputType | null
    _min: JuryCaseMinAggregateOutputType | null
    _max: JuryCaseMaxAggregateOutputType | null
  }

  type GetJuryCaseGroupByPayload<T extends JuryCaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JuryCaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JuryCaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JuryCaseGroupByOutputType[P]>
            : GetScalarType<T[P], JuryCaseGroupByOutputType[P]>
        }
      >
    >


  export type JuryCaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    status?: boolean
    forVotes?: boolean
    againstVotes?: boolean
    totalVotes?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    jurors?: boolean | JuryCase$jurorsArgs<ExtArgs>
    votes?: boolean | JuryCase$votesArgs<ExtArgs>
    _count?: boolean | JuryCaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["juryCase"]>

  export type JuryCaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    status?: boolean
    forVotes?: boolean
    againstVotes?: boolean
    totalVotes?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["juryCase"]>

  export type JuryCaseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    status?: boolean
    forVotes?: boolean
    againstVotes?: boolean
    totalVotes?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["juryCase"]>

  export type JuryCaseSelectScalar = {
    id?: boolean
    caseId?: boolean
    status?: boolean
    forVotes?: boolean
    againstVotes?: boolean
    totalVotes?: boolean
    resolvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type JuryCaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "caseId" | "status" | "forVotes" | "againstVotes" | "totalVotes" | "resolvedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["juryCase"]>
  export type JuryCaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jurors?: boolean | JuryCase$jurorsArgs<ExtArgs>
    votes?: boolean | JuryCase$votesArgs<ExtArgs>
    _count?: boolean | JuryCaseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type JuryCaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type JuryCaseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $JuryCasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JuryCase"
    objects: {
      jurors: Prisma.$CaseJurorPayload<ExtArgs>[]
      votes: Prisma.$CaseVotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      caseId: number
      status: string
      forVotes: number
      againstVotes: number
      totalVotes: number
      resolvedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["juryCase"]>
    composites: {}
  }

  type JuryCaseGetPayload<S extends boolean | null | undefined | JuryCaseDefaultArgs> = $Result.GetResult<Prisma.$JuryCasePayload, S>

  type JuryCaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JuryCaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JuryCaseCountAggregateInputType | true
    }

  export interface JuryCaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JuryCase'], meta: { name: 'JuryCase' } }
    /**
     * Find zero or one JuryCase that matches the filter.
     * @param {JuryCaseFindUniqueArgs} args - Arguments to find a JuryCase
     * @example
     * // Get one JuryCase
     * const juryCase = await prisma.juryCase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JuryCaseFindUniqueArgs>(args: SelectSubset<T, JuryCaseFindUniqueArgs<ExtArgs>>): Prisma__JuryCaseClient<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JuryCase that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JuryCaseFindUniqueOrThrowArgs} args - Arguments to find a JuryCase
     * @example
     * // Get one JuryCase
     * const juryCase = await prisma.juryCase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JuryCaseFindUniqueOrThrowArgs>(args: SelectSubset<T, JuryCaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JuryCaseClient<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JuryCase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuryCaseFindFirstArgs} args - Arguments to find a JuryCase
     * @example
     * // Get one JuryCase
     * const juryCase = await prisma.juryCase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JuryCaseFindFirstArgs>(args?: SelectSubset<T, JuryCaseFindFirstArgs<ExtArgs>>): Prisma__JuryCaseClient<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JuryCase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuryCaseFindFirstOrThrowArgs} args - Arguments to find a JuryCase
     * @example
     * // Get one JuryCase
     * const juryCase = await prisma.juryCase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JuryCaseFindFirstOrThrowArgs>(args?: SelectSubset<T, JuryCaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__JuryCaseClient<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JuryCases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuryCaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JuryCases
     * const juryCases = await prisma.juryCase.findMany()
     * 
     * // Get first 10 JuryCases
     * const juryCases = await prisma.juryCase.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const juryCaseWithIdOnly = await prisma.juryCase.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JuryCaseFindManyArgs>(args?: SelectSubset<T, JuryCaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JuryCase.
     * @param {JuryCaseCreateArgs} args - Arguments to create a JuryCase.
     * @example
     * // Create one JuryCase
     * const JuryCase = await prisma.juryCase.create({
     *   data: {
     *     // ... data to create a JuryCase
     *   }
     * })
     * 
     */
    create<T extends JuryCaseCreateArgs>(args: SelectSubset<T, JuryCaseCreateArgs<ExtArgs>>): Prisma__JuryCaseClient<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JuryCases.
     * @param {JuryCaseCreateManyArgs} args - Arguments to create many JuryCases.
     * @example
     * // Create many JuryCases
     * const juryCase = await prisma.juryCase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JuryCaseCreateManyArgs>(args?: SelectSubset<T, JuryCaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JuryCases and returns the data saved in the database.
     * @param {JuryCaseCreateManyAndReturnArgs} args - Arguments to create many JuryCases.
     * @example
     * // Create many JuryCases
     * const juryCase = await prisma.juryCase.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JuryCases and only return the `id`
     * const juryCaseWithIdOnly = await prisma.juryCase.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JuryCaseCreateManyAndReturnArgs>(args?: SelectSubset<T, JuryCaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JuryCase.
     * @param {JuryCaseDeleteArgs} args - Arguments to delete one JuryCase.
     * @example
     * // Delete one JuryCase
     * const JuryCase = await prisma.juryCase.delete({
     *   where: {
     *     // ... filter to delete one JuryCase
     *   }
     * })
     * 
     */
    delete<T extends JuryCaseDeleteArgs>(args: SelectSubset<T, JuryCaseDeleteArgs<ExtArgs>>): Prisma__JuryCaseClient<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JuryCase.
     * @param {JuryCaseUpdateArgs} args - Arguments to update one JuryCase.
     * @example
     * // Update one JuryCase
     * const juryCase = await prisma.juryCase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JuryCaseUpdateArgs>(args: SelectSubset<T, JuryCaseUpdateArgs<ExtArgs>>): Prisma__JuryCaseClient<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JuryCases.
     * @param {JuryCaseDeleteManyArgs} args - Arguments to filter JuryCases to delete.
     * @example
     * // Delete a few JuryCases
     * const { count } = await prisma.juryCase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JuryCaseDeleteManyArgs>(args?: SelectSubset<T, JuryCaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JuryCases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuryCaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JuryCases
     * const juryCase = await prisma.juryCase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JuryCaseUpdateManyArgs>(args: SelectSubset<T, JuryCaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JuryCases and returns the data updated in the database.
     * @param {JuryCaseUpdateManyAndReturnArgs} args - Arguments to update many JuryCases.
     * @example
     * // Update many JuryCases
     * const juryCase = await prisma.juryCase.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JuryCases and only return the `id`
     * const juryCaseWithIdOnly = await prisma.juryCase.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JuryCaseUpdateManyAndReturnArgs>(args: SelectSubset<T, JuryCaseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JuryCase.
     * @param {JuryCaseUpsertArgs} args - Arguments to update or create a JuryCase.
     * @example
     * // Update or create a JuryCase
     * const juryCase = await prisma.juryCase.upsert({
     *   create: {
     *     // ... data to create a JuryCase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JuryCase we want to update
     *   }
     * })
     */
    upsert<T extends JuryCaseUpsertArgs>(args: SelectSubset<T, JuryCaseUpsertArgs<ExtArgs>>): Prisma__JuryCaseClient<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JuryCases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuryCaseCountArgs} args - Arguments to filter JuryCases to count.
     * @example
     * // Count the number of JuryCases
     * const count = await prisma.juryCase.count({
     *   where: {
     *     // ... the filter for the JuryCases we want to count
     *   }
     * })
    **/
    count<T extends JuryCaseCountArgs>(
      args?: Subset<T, JuryCaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JuryCaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JuryCase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuryCaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JuryCaseAggregateArgs>(args: Subset<T, JuryCaseAggregateArgs>): Prisma.PrismaPromise<GetJuryCaseAggregateType<T>>

    /**
     * Group by JuryCase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JuryCaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JuryCaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JuryCaseGroupByArgs['orderBy'] }
        : { orderBy?: JuryCaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JuryCaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJuryCaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JuryCase model
   */
  readonly fields: JuryCaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JuryCase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JuryCaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    jurors<T extends JuryCase$jurorsArgs<ExtArgs> = {}>(args?: Subset<T, JuryCase$jurorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    votes<T extends JuryCase$votesArgs<ExtArgs> = {}>(args?: Subset<T, JuryCase$votesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JuryCase model
   */
  interface JuryCaseFieldRefs {
    readonly id: FieldRef<"JuryCase", 'Int'>
    readonly caseId: FieldRef<"JuryCase", 'Int'>
    readonly status: FieldRef<"JuryCase", 'String'>
    readonly forVotes: FieldRef<"JuryCase", 'Int'>
    readonly againstVotes: FieldRef<"JuryCase", 'Int'>
    readonly totalVotes: FieldRef<"JuryCase", 'Int'>
    readonly resolvedAt: FieldRef<"JuryCase", 'DateTime'>
    readonly createdAt: FieldRef<"JuryCase", 'DateTime'>
    readonly updatedAt: FieldRef<"JuryCase", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JuryCase findUnique
   */
  export type JuryCaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuryCaseInclude<ExtArgs> | null
    /**
     * Filter, which JuryCase to fetch.
     */
    where: JuryCaseWhereUniqueInput
  }

  /**
   * JuryCase findUniqueOrThrow
   */
  export type JuryCaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuryCaseInclude<ExtArgs> | null
    /**
     * Filter, which JuryCase to fetch.
     */
    where: JuryCaseWhereUniqueInput
  }

  /**
   * JuryCase findFirst
   */
  export type JuryCaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuryCaseInclude<ExtArgs> | null
    /**
     * Filter, which JuryCase to fetch.
     */
    where?: JuryCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JuryCases to fetch.
     */
    orderBy?: JuryCaseOrderByWithRelationInput | JuryCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JuryCases.
     */
    cursor?: JuryCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JuryCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JuryCases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JuryCases.
     */
    distinct?: JuryCaseScalarFieldEnum | JuryCaseScalarFieldEnum[]
  }

  /**
   * JuryCase findFirstOrThrow
   */
  export type JuryCaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuryCaseInclude<ExtArgs> | null
    /**
     * Filter, which JuryCase to fetch.
     */
    where?: JuryCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JuryCases to fetch.
     */
    orderBy?: JuryCaseOrderByWithRelationInput | JuryCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JuryCases.
     */
    cursor?: JuryCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JuryCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JuryCases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JuryCases.
     */
    distinct?: JuryCaseScalarFieldEnum | JuryCaseScalarFieldEnum[]
  }

  /**
   * JuryCase findMany
   */
  export type JuryCaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuryCaseInclude<ExtArgs> | null
    /**
     * Filter, which JuryCases to fetch.
     */
    where?: JuryCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JuryCases to fetch.
     */
    orderBy?: JuryCaseOrderByWithRelationInput | JuryCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JuryCases.
     */
    cursor?: JuryCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JuryCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JuryCases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JuryCases.
     */
    distinct?: JuryCaseScalarFieldEnum | JuryCaseScalarFieldEnum[]
  }

  /**
   * JuryCase create
   */
  export type JuryCaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuryCaseInclude<ExtArgs> | null
    /**
     * The data needed to create a JuryCase.
     */
    data: XOR<JuryCaseCreateInput, JuryCaseUncheckedCreateInput>
  }

  /**
   * JuryCase createMany
   */
  export type JuryCaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JuryCases.
     */
    data: JuryCaseCreateManyInput | JuryCaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JuryCase createManyAndReturn
   */
  export type JuryCaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * The data used to create many JuryCases.
     */
    data: JuryCaseCreateManyInput | JuryCaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JuryCase update
   */
  export type JuryCaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuryCaseInclude<ExtArgs> | null
    /**
     * The data needed to update a JuryCase.
     */
    data: XOR<JuryCaseUpdateInput, JuryCaseUncheckedUpdateInput>
    /**
     * Choose, which JuryCase to update.
     */
    where: JuryCaseWhereUniqueInput
  }

  /**
   * JuryCase updateMany
   */
  export type JuryCaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JuryCases.
     */
    data: XOR<JuryCaseUpdateManyMutationInput, JuryCaseUncheckedUpdateManyInput>
    /**
     * Filter which JuryCases to update
     */
    where?: JuryCaseWhereInput
    /**
     * Limit how many JuryCases to update.
     */
    limit?: number
  }

  /**
   * JuryCase updateManyAndReturn
   */
  export type JuryCaseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * The data used to update JuryCases.
     */
    data: XOR<JuryCaseUpdateManyMutationInput, JuryCaseUncheckedUpdateManyInput>
    /**
     * Filter which JuryCases to update
     */
    where?: JuryCaseWhereInput
    /**
     * Limit how many JuryCases to update.
     */
    limit?: number
  }

  /**
   * JuryCase upsert
   */
  export type JuryCaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuryCaseInclude<ExtArgs> | null
    /**
     * The filter to search for the JuryCase to update in case it exists.
     */
    where: JuryCaseWhereUniqueInput
    /**
     * In case the JuryCase found by the `where` argument doesn't exist, create a new JuryCase with this data.
     */
    create: XOR<JuryCaseCreateInput, JuryCaseUncheckedCreateInput>
    /**
     * In case the JuryCase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JuryCaseUpdateInput, JuryCaseUncheckedUpdateInput>
  }

  /**
   * JuryCase delete
   */
  export type JuryCaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuryCaseInclude<ExtArgs> | null
    /**
     * Filter which JuryCase to delete.
     */
    where: JuryCaseWhereUniqueInput
  }

  /**
   * JuryCase deleteMany
   */
  export type JuryCaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JuryCases to delete
     */
    where?: JuryCaseWhereInput
    /**
     * Limit how many JuryCases to delete.
     */
    limit?: number
  }

  /**
   * JuryCase.jurors
   */
  export type JuryCase$jurorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
    where?: CaseJurorWhereInput
    orderBy?: CaseJurorOrderByWithRelationInput | CaseJurorOrderByWithRelationInput[]
    cursor?: CaseJurorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseJurorScalarFieldEnum | CaseJurorScalarFieldEnum[]
  }

  /**
   * JuryCase.votes
   */
  export type JuryCase$votesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
    where?: CaseVoteWhereInput
    orderBy?: CaseVoteOrderByWithRelationInput | CaseVoteOrderByWithRelationInput[]
    cursor?: CaseVoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CaseVoteScalarFieldEnum | CaseVoteScalarFieldEnum[]
  }

  /**
   * JuryCase without action
   */
  export type JuryCaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JuryCase
     */
    select?: JuryCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JuryCase
     */
    omit?: JuryCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JuryCaseInclude<ExtArgs> | null
  }


  /**
   * Model CaseJuror
   */

  export type AggregateCaseJuror = {
    _count: CaseJurorCountAggregateOutputType | null
    _avg: CaseJurorAvgAggregateOutputType | null
    _sum: CaseJurorSumAggregateOutputType | null
    _min: CaseJurorMinAggregateOutputType | null
    _max: CaseJurorMaxAggregateOutputType | null
  }

  export type CaseJurorAvgAggregateOutputType = {
    id: number | null
    caseId: number | null
  }

  export type CaseJurorSumAggregateOutputType = {
    id: number | null
    caseId: number | null
  }

  export type CaseJurorMinAggregateOutputType = {
    id: number | null
    caseId: number | null
    jurorAddr: string | null
    assignedAt: Date | null
  }

  export type CaseJurorMaxAggregateOutputType = {
    id: number | null
    caseId: number | null
    jurorAddr: string | null
    assignedAt: Date | null
  }

  export type CaseJurorCountAggregateOutputType = {
    id: number
    caseId: number
    jurorAddr: number
    assignedAt: number
    _all: number
  }


  export type CaseJurorAvgAggregateInputType = {
    id?: true
    caseId?: true
  }

  export type CaseJurorSumAggregateInputType = {
    id?: true
    caseId?: true
  }

  export type CaseJurorMinAggregateInputType = {
    id?: true
    caseId?: true
    jurorAddr?: true
    assignedAt?: true
  }

  export type CaseJurorMaxAggregateInputType = {
    id?: true
    caseId?: true
    jurorAddr?: true
    assignedAt?: true
  }

  export type CaseJurorCountAggregateInputType = {
    id?: true
    caseId?: true
    jurorAddr?: true
    assignedAt?: true
    _all?: true
  }

  export type CaseJurorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseJuror to aggregate.
     */
    where?: CaseJurorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseJurors to fetch.
     */
    orderBy?: CaseJurorOrderByWithRelationInput | CaseJurorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseJurorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseJurors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseJurors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CaseJurors
    **/
    _count?: true | CaseJurorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CaseJurorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CaseJurorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseJurorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseJurorMaxAggregateInputType
  }

  export type GetCaseJurorAggregateType<T extends CaseJurorAggregateArgs> = {
        [P in keyof T & keyof AggregateCaseJuror]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCaseJuror[P]>
      : GetScalarType<T[P], AggregateCaseJuror[P]>
  }




  export type CaseJurorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseJurorWhereInput
    orderBy?: CaseJurorOrderByWithAggregationInput | CaseJurorOrderByWithAggregationInput[]
    by: CaseJurorScalarFieldEnum[] | CaseJurorScalarFieldEnum
    having?: CaseJurorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseJurorCountAggregateInputType | true
    _avg?: CaseJurorAvgAggregateInputType
    _sum?: CaseJurorSumAggregateInputType
    _min?: CaseJurorMinAggregateInputType
    _max?: CaseJurorMaxAggregateInputType
  }

  export type CaseJurorGroupByOutputType = {
    id: number
    caseId: number
    jurorAddr: string
    assignedAt: Date
    _count: CaseJurorCountAggregateOutputType | null
    _avg: CaseJurorAvgAggregateOutputType | null
    _sum: CaseJurorSumAggregateOutputType | null
    _min: CaseJurorMinAggregateOutputType | null
    _max: CaseJurorMaxAggregateOutputType | null
  }

  type GetCaseJurorGroupByPayload<T extends CaseJurorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseJurorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseJurorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseJurorGroupByOutputType[P]>
            : GetScalarType<T[P], CaseJurorGroupByOutputType[P]>
        }
      >
    >


  export type CaseJurorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    jurorAddr?: boolean
    assignedAt?: boolean
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseJuror"]>

  export type CaseJurorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    jurorAddr?: boolean
    assignedAt?: boolean
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseJuror"]>

  export type CaseJurorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    jurorAddr?: boolean
    assignedAt?: boolean
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseJuror"]>

  export type CaseJurorSelectScalar = {
    id?: boolean
    caseId?: boolean
    jurorAddr?: boolean
    assignedAt?: boolean
  }

  export type CaseJurorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "caseId" | "jurorAddr" | "assignedAt", ExtArgs["result"]["caseJuror"]>
  export type CaseJurorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }
  export type CaseJurorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }
  export type CaseJurorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }

  export type $CaseJurorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CaseJuror"
    objects: {
      case: Prisma.$JuryCasePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      caseId: number
      jurorAddr: string
      assignedAt: Date
    }, ExtArgs["result"]["caseJuror"]>
    composites: {}
  }

  type CaseJurorGetPayload<S extends boolean | null | undefined | CaseJurorDefaultArgs> = $Result.GetResult<Prisma.$CaseJurorPayload, S>

  type CaseJurorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CaseJurorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CaseJurorCountAggregateInputType | true
    }

  export interface CaseJurorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CaseJuror'], meta: { name: 'CaseJuror' } }
    /**
     * Find zero or one CaseJuror that matches the filter.
     * @param {CaseJurorFindUniqueArgs} args - Arguments to find a CaseJuror
     * @example
     * // Get one CaseJuror
     * const caseJuror = await prisma.caseJuror.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseJurorFindUniqueArgs>(args: SelectSubset<T, CaseJurorFindUniqueArgs<ExtArgs>>): Prisma__CaseJurorClient<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CaseJuror that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CaseJurorFindUniqueOrThrowArgs} args - Arguments to find a CaseJuror
     * @example
     * // Get one CaseJuror
     * const caseJuror = await prisma.caseJuror.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseJurorFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseJurorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseJurorClient<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseJuror that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJurorFindFirstArgs} args - Arguments to find a CaseJuror
     * @example
     * // Get one CaseJuror
     * const caseJuror = await prisma.caseJuror.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseJurorFindFirstArgs>(args?: SelectSubset<T, CaseJurorFindFirstArgs<ExtArgs>>): Prisma__CaseJurorClient<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseJuror that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJurorFindFirstOrThrowArgs} args - Arguments to find a CaseJuror
     * @example
     * // Get one CaseJuror
     * const caseJuror = await prisma.caseJuror.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseJurorFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseJurorFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseJurorClient<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CaseJurors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJurorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CaseJurors
     * const caseJurors = await prisma.caseJuror.findMany()
     * 
     * // Get first 10 CaseJurors
     * const caseJurors = await prisma.caseJuror.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const caseJurorWithIdOnly = await prisma.caseJuror.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CaseJurorFindManyArgs>(args?: SelectSubset<T, CaseJurorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CaseJuror.
     * @param {CaseJurorCreateArgs} args - Arguments to create a CaseJuror.
     * @example
     * // Create one CaseJuror
     * const CaseJuror = await prisma.caseJuror.create({
     *   data: {
     *     // ... data to create a CaseJuror
     *   }
     * })
     * 
     */
    create<T extends CaseJurorCreateArgs>(args: SelectSubset<T, CaseJurorCreateArgs<ExtArgs>>): Prisma__CaseJurorClient<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CaseJurors.
     * @param {CaseJurorCreateManyArgs} args - Arguments to create many CaseJurors.
     * @example
     * // Create many CaseJurors
     * const caseJuror = await prisma.caseJuror.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseJurorCreateManyArgs>(args?: SelectSubset<T, CaseJurorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CaseJurors and returns the data saved in the database.
     * @param {CaseJurorCreateManyAndReturnArgs} args - Arguments to create many CaseJurors.
     * @example
     * // Create many CaseJurors
     * const caseJuror = await prisma.caseJuror.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CaseJurors and only return the `id`
     * const caseJurorWithIdOnly = await prisma.caseJuror.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CaseJurorCreateManyAndReturnArgs>(args?: SelectSubset<T, CaseJurorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CaseJuror.
     * @param {CaseJurorDeleteArgs} args - Arguments to delete one CaseJuror.
     * @example
     * // Delete one CaseJuror
     * const CaseJuror = await prisma.caseJuror.delete({
     *   where: {
     *     // ... filter to delete one CaseJuror
     *   }
     * })
     * 
     */
    delete<T extends CaseJurorDeleteArgs>(args: SelectSubset<T, CaseJurorDeleteArgs<ExtArgs>>): Prisma__CaseJurorClient<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CaseJuror.
     * @param {CaseJurorUpdateArgs} args - Arguments to update one CaseJuror.
     * @example
     * // Update one CaseJuror
     * const caseJuror = await prisma.caseJuror.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseJurorUpdateArgs>(args: SelectSubset<T, CaseJurorUpdateArgs<ExtArgs>>): Prisma__CaseJurorClient<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CaseJurors.
     * @param {CaseJurorDeleteManyArgs} args - Arguments to filter CaseJurors to delete.
     * @example
     * // Delete a few CaseJurors
     * const { count } = await prisma.caseJuror.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseJurorDeleteManyArgs>(args?: SelectSubset<T, CaseJurorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseJurors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJurorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CaseJurors
     * const caseJuror = await prisma.caseJuror.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseJurorUpdateManyArgs>(args: SelectSubset<T, CaseJurorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseJurors and returns the data updated in the database.
     * @param {CaseJurorUpdateManyAndReturnArgs} args - Arguments to update many CaseJurors.
     * @example
     * // Update many CaseJurors
     * const caseJuror = await prisma.caseJuror.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CaseJurors and only return the `id`
     * const caseJurorWithIdOnly = await prisma.caseJuror.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CaseJurorUpdateManyAndReturnArgs>(args: SelectSubset<T, CaseJurorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CaseJuror.
     * @param {CaseJurorUpsertArgs} args - Arguments to update or create a CaseJuror.
     * @example
     * // Update or create a CaseJuror
     * const caseJuror = await prisma.caseJuror.upsert({
     *   create: {
     *     // ... data to create a CaseJuror
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CaseJuror we want to update
     *   }
     * })
     */
    upsert<T extends CaseJurorUpsertArgs>(args: SelectSubset<T, CaseJurorUpsertArgs<ExtArgs>>): Prisma__CaseJurorClient<$Result.GetResult<Prisma.$CaseJurorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CaseJurors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJurorCountArgs} args - Arguments to filter CaseJurors to count.
     * @example
     * // Count the number of CaseJurors
     * const count = await prisma.caseJuror.count({
     *   where: {
     *     // ... the filter for the CaseJurors we want to count
     *   }
     * })
    **/
    count<T extends CaseJurorCountArgs>(
      args?: Subset<T, CaseJurorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseJurorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CaseJuror.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJurorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseJurorAggregateArgs>(args: Subset<T, CaseJurorAggregateArgs>): Prisma.PrismaPromise<GetCaseJurorAggregateType<T>>

    /**
     * Group by CaseJuror.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseJurorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseJurorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseJurorGroupByArgs['orderBy'] }
        : { orderBy?: CaseJurorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseJurorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseJurorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CaseJuror model
   */
  readonly fields: CaseJurorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CaseJuror.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseJurorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends JuryCaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JuryCaseDefaultArgs<ExtArgs>>): Prisma__JuryCaseClient<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CaseJuror model
   */
  interface CaseJurorFieldRefs {
    readonly id: FieldRef<"CaseJuror", 'Int'>
    readonly caseId: FieldRef<"CaseJuror", 'Int'>
    readonly jurorAddr: FieldRef<"CaseJuror", 'String'>
    readonly assignedAt: FieldRef<"CaseJuror", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CaseJuror findUnique
   */
  export type CaseJurorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
    /**
     * Filter, which CaseJuror to fetch.
     */
    where: CaseJurorWhereUniqueInput
  }

  /**
   * CaseJuror findUniqueOrThrow
   */
  export type CaseJurorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
    /**
     * Filter, which CaseJuror to fetch.
     */
    where: CaseJurorWhereUniqueInput
  }

  /**
   * CaseJuror findFirst
   */
  export type CaseJurorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
    /**
     * Filter, which CaseJuror to fetch.
     */
    where?: CaseJurorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseJurors to fetch.
     */
    orderBy?: CaseJurorOrderByWithRelationInput | CaseJurorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseJurors.
     */
    cursor?: CaseJurorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseJurors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseJurors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseJurors.
     */
    distinct?: CaseJurorScalarFieldEnum | CaseJurorScalarFieldEnum[]
  }

  /**
   * CaseJuror findFirstOrThrow
   */
  export type CaseJurorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
    /**
     * Filter, which CaseJuror to fetch.
     */
    where?: CaseJurorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseJurors to fetch.
     */
    orderBy?: CaseJurorOrderByWithRelationInput | CaseJurorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseJurors.
     */
    cursor?: CaseJurorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseJurors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseJurors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseJurors.
     */
    distinct?: CaseJurorScalarFieldEnum | CaseJurorScalarFieldEnum[]
  }

  /**
   * CaseJuror findMany
   */
  export type CaseJurorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
    /**
     * Filter, which CaseJurors to fetch.
     */
    where?: CaseJurorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseJurors to fetch.
     */
    orderBy?: CaseJurorOrderByWithRelationInput | CaseJurorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CaseJurors.
     */
    cursor?: CaseJurorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseJurors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseJurors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseJurors.
     */
    distinct?: CaseJurorScalarFieldEnum | CaseJurorScalarFieldEnum[]
  }

  /**
   * CaseJuror create
   */
  export type CaseJurorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
    /**
     * The data needed to create a CaseJuror.
     */
    data: XOR<CaseJurorCreateInput, CaseJurorUncheckedCreateInput>
  }

  /**
   * CaseJuror createMany
   */
  export type CaseJurorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CaseJurors.
     */
    data: CaseJurorCreateManyInput | CaseJurorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CaseJuror createManyAndReturn
   */
  export type CaseJurorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * The data used to create many CaseJurors.
     */
    data: CaseJurorCreateManyInput | CaseJurorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseJuror update
   */
  export type CaseJurorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
    /**
     * The data needed to update a CaseJuror.
     */
    data: XOR<CaseJurorUpdateInput, CaseJurorUncheckedUpdateInput>
    /**
     * Choose, which CaseJuror to update.
     */
    where: CaseJurorWhereUniqueInput
  }

  /**
   * CaseJuror updateMany
   */
  export type CaseJurorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CaseJurors.
     */
    data: XOR<CaseJurorUpdateManyMutationInput, CaseJurorUncheckedUpdateManyInput>
    /**
     * Filter which CaseJurors to update
     */
    where?: CaseJurorWhereInput
    /**
     * Limit how many CaseJurors to update.
     */
    limit?: number
  }

  /**
   * CaseJuror updateManyAndReturn
   */
  export type CaseJurorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * The data used to update CaseJurors.
     */
    data: XOR<CaseJurorUpdateManyMutationInput, CaseJurorUncheckedUpdateManyInput>
    /**
     * Filter which CaseJurors to update
     */
    where?: CaseJurorWhereInput
    /**
     * Limit how many CaseJurors to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseJuror upsert
   */
  export type CaseJurorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
    /**
     * The filter to search for the CaseJuror to update in case it exists.
     */
    where: CaseJurorWhereUniqueInput
    /**
     * In case the CaseJuror found by the `where` argument doesn't exist, create a new CaseJuror with this data.
     */
    create: XOR<CaseJurorCreateInput, CaseJurorUncheckedCreateInput>
    /**
     * In case the CaseJuror was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseJurorUpdateInput, CaseJurorUncheckedUpdateInput>
  }

  /**
   * CaseJuror delete
   */
  export type CaseJurorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
    /**
     * Filter which CaseJuror to delete.
     */
    where: CaseJurorWhereUniqueInput
  }

  /**
   * CaseJuror deleteMany
   */
  export type CaseJurorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseJurors to delete
     */
    where?: CaseJurorWhereInput
    /**
     * Limit how many CaseJurors to delete.
     */
    limit?: number
  }

  /**
   * CaseJuror without action
   */
  export type CaseJurorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseJuror
     */
    select?: CaseJurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseJuror
     */
    omit?: CaseJurorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseJurorInclude<ExtArgs> | null
  }


  /**
   * Model CaseVote
   */

  export type AggregateCaseVote = {
    _count: CaseVoteCountAggregateOutputType | null
    _avg: CaseVoteAvgAggregateOutputType | null
    _sum: CaseVoteSumAggregateOutputType | null
    _min: CaseVoteMinAggregateOutputType | null
    _max: CaseVoteMaxAggregateOutputType | null
  }

  export type CaseVoteAvgAggregateOutputType = {
    id: number | null
    caseId: number | null
  }

  export type CaseVoteSumAggregateOutputType = {
    id: number | null
    caseId: number | null
  }

  export type CaseVoteMinAggregateOutputType = {
    id: number | null
    caseId: number | null
    jurorAddr: string | null
    vote: string | null
    timestamp: Date | null
  }

  export type CaseVoteMaxAggregateOutputType = {
    id: number | null
    caseId: number | null
    jurorAddr: string | null
    vote: string | null
    timestamp: Date | null
  }

  export type CaseVoteCountAggregateOutputType = {
    id: number
    caseId: number
    jurorAddr: number
    vote: number
    timestamp: number
    _all: number
  }


  export type CaseVoteAvgAggregateInputType = {
    id?: true
    caseId?: true
  }

  export type CaseVoteSumAggregateInputType = {
    id?: true
    caseId?: true
  }

  export type CaseVoteMinAggregateInputType = {
    id?: true
    caseId?: true
    jurorAddr?: true
    vote?: true
    timestamp?: true
  }

  export type CaseVoteMaxAggregateInputType = {
    id?: true
    caseId?: true
    jurorAddr?: true
    vote?: true
    timestamp?: true
  }

  export type CaseVoteCountAggregateInputType = {
    id?: true
    caseId?: true
    jurorAddr?: true
    vote?: true
    timestamp?: true
    _all?: true
  }

  export type CaseVoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseVote to aggregate.
     */
    where?: CaseVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseVotes to fetch.
     */
    orderBy?: CaseVoteOrderByWithRelationInput | CaseVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CaseVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CaseVotes
    **/
    _count?: true | CaseVoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CaseVoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CaseVoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CaseVoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CaseVoteMaxAggregateInputType
  }

  export type GetCaseVoteAggregateType<T extends CaseVoteAggregateArgs> = {
        [P in keyof T & keyof AggregateCaseVote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCaseVote[P]>
      : GetScalarType<T[P], AggregateCaseVote[P]>
  }




  export type CaseVoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CaseVoteWhereInput
    orderBy?: CaseVoteOrderByWithAggregationInput | CaseVoteOrderByWithAggregationInput[]
    by: CaseVoteScalarFieldEnum[] | CaseVoteScalarFieldEnum
    having?: CaseVoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CaseVoteCountAggregateInputType | true
    _avg?: CaseVoteAvgAggregateInputType
    _sum?: CaseVoteSumAggregateInputType
    _min?: CaseVoteMinAggregateInputType
    _max?: CaseVoteMaxAggregateInputType
  }

  export type CaseVoteGroupByOutputType = {
    id: number
    caseId: number
    jurorAddr: string
    vote: string
    timestamp: Date
    _count: CaseVoteCountAggregateOutputType | null
    _avg: CaseVoteAvgAggregateOutputType | null
    _sum: CaseVoteSumAggregateOutputType | null
    _min: CaseVoteMinAggregateOutputType | null
    _max: CaseVoteMaxAggregateOutputType | null
  }

  type GetCaseVoteGroupByPayload<T extends CaseVoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CaseVoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CaseVoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CaseVoteGroupByOutputType[P]>
            : GetScalarType<T[P], CaseVoteGroupByOutputType[P]>
        }
      >
    >


  export type CaseVoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    jurorAddr?: boolean
    vote?: boolean
    timestamp?: boolean
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseVote"]>

  export type CaseVoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    jurorAddr?: boolean
    vote?: boolean
    timestamp?: boolean
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseVote"]>

  export type CaseVoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    caseId?: boolean
    jurorAddr?: boolean
    vote?: boolean
    timestamp?: boolean
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["caseVote"]>

  export type CaseVoteSelectScalar = {
    id?: boolean
    caseId?: boolean
    jurorAddr?: boolean
    vote?: boolean
    timestamp?: boolean
  }

  export type CaseVoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "caseId" | "jurorAddr" | "vote" | "timestamp", ExtArgs["result"]["caseVote"]>
  export type CaseVoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }
  export type CaseVoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }
  export type CaseVoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    case?: boolean | JuryCaseDefaultArgs<ExtArgs>
  }

  export type $CaseVotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CaseVote"
    objects: {
      case: Prisma.$JuryCasePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      caseId: number
      jurorAddr: string
      vote: string
      timestamp: Date
    }, ExtArgs["result"]["caseVote"]>
    composites: {}
  }

  type CaseVoteGetPayload<S extends boolean | null | undefined | CaseVoteDefaultArgs> = $Result.GetResult<Prisma.$CaseVotePayload, S>

  type CaseVoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CaseVoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CaseVoteCountAggregateInputType | true
    }

  export interface CaseVoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CaseVote'], meta: { name: 'CaseVote' } }
    /**
     * Find zero or one CaseVote that matches the filter.
     * @param {CaseVoteFindUniqueArgs} args - Arguments to find a CaseVote
     * @example
     * // Get one CaseVote
     * const caseVote = await prisma.caseVote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CaseVoteFindUniqueArgs>(args: SelectSubset<T, CaseVoteFindUniqueArgs<ExtArgs>>): Prisma__CaseVoteClient<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CaseVote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CaseVoteFindUniqueOrThrowArgs} args - Arguments to find a CaseVote
     * @example
     * // Get one CaseVote
     * const caseVote = await prisma.caseVote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CaseVoteFindUniqueOrThrowArgs>(args: SelectSubset<T, CaseVoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CaseVoteClient<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseVote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseVoteFindFirstArgs} args - Arguments to find a CaseVote
     * @example
     * // Get one CaseVote
     * const caseVote = await prisma.caseVote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CaseVoteFindFirstArgs>(args?: SelectSubset<T, CaseVoteFindFirstArgs<ExtArgs>>): Prisma__CaseVoteClient<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CaseVote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseVoteFindFirstOrThrowArgs} args - Arguments to find a CaseVote
     * @example
     * // Get one CaseVote
     * const caseVote = await prisma.caseVote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CaseVoteFindFirstOrThrowArgs>(args?: SelectSubset<T, CaseVoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__CaseVoteClient<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CaseVotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseVoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CaseVotes
     * const caseVotes = await prisma.caseVote.findMany()
     * 
     * // Get first 10 CaseVotes
     * const caseVotes = await prisma.caseVote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const caseVoteWithIdOnly = await prisma.caseVote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CaseVoteFindManyArgs>(args?: SelectSubset<T, CaseVoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CaseVote.
     * @param {CaseVoteCreateArgs} args - Arguments to create a CaseVote.
     * @example
     * // Create one CaseVote
     * const CaseVote = await prisma.caseVote.create({
     *   data: {
     *     // ... data to create a CaseVote
     *   }
     * })
     * 
     */
    create<T extends CaseVoteCreateArgs>(args: SelectSubset<T, CaseVoteCreateArgs<ExtArgs>>): Prisma__CaseVoteClient<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CaseVotes.
     * @param {CaseVoteCreateManyArgs} args - Arguments to create many CaseVotes.
     * @example
     * // Create many CaseVotes
     * const caseVote = await prisma.caseVote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CaseVoteCreateManyArgs>(args?: SelectSubset<T, CaseVoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CaseVotes and returns the data saved in the database.
     * @param {CaseVoteCreateManyAndReturnArgs} args - Arguments to create many CaseVotes.
     * @example
     * // Create many CaseVotes
     * const caseVote = await prisma.caseVote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CaseVotes and only return the `id`
     * const caseVoteWithIdOnly = await prisma.caseVote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CaseVoteCreateManyAndReturnArgs>(args?: SelectSubset<T, CaseVoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CaseVote.
     * @param {CaseVoteDeleteArgs} args - Arguments to delete one CaseVote.
     * @example
     * // Delete one CaseVote
     * const CaseVote = await prisma.caseVote.delete({
     *   where: {
     *     // ... filter to delete one CaseVote
     *   }
     * })
     * 
     */
    delete<T extends CaseVoteDeleteArgs>(args: SelectSubset<T, CaseVoteDeleteArgs<ExtArgs>>): Prisma__CaseVoteClient<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CaseVote.
     * @param {CaseVoteUpdateArgs} args - Arguments to update one CaseVote.
     * @example
     * // Update one CaseVote
     * const caseVote = await prisma.caseVote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CaseVoteUpdateArgs>(args: SelectSubset<T, CaseVoteUpdateArgs<ExtArgs>>): Prisma__CaseVoteClient<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CaseVotes.
     * @param {CaseVoteDeleteManyArgs} args - Arguments to filter CaseVotes to delete.
     * @example
     * // Delete a few CaseVotes
     * const { count } = await prisma.caseVote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CaseVoteDeleteManyArgs>(args?: SelectSubset<T, CaseVoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseVotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseVoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CaseVotes
     * const caseVote = await prisma.caseVote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CaseVoteUpdateManyArgs>(args: SelectSubset<T, CaseVoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CaseVotes and returns the data updated in the database.
     * @param {CaseVoteUpdateManyAndReturnArgs} args - Arguments to update many CaseVotes.
     * @example
     * // Update many CaseVotes
     * const caseVote = await prisma.caseVote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CaseVotes and only return the `id`
     * const caseVoteWithIdOnly = await prisma.caseVote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CaseVoteUpdateManyAndReturnArgs>(args: SelectSubset<T, CaseVoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CaseVote.
     * @param {CaseVoteUpsertArgs} args - Arguments to update or create a CaseVote.
     * @example
     * // Update or create a CaseVote
     * const caseVote = await prisma.caseVote.upsert({
     *   create: {
     *     // ... data to create a CaseVote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CaseVote we want to update
     *   }
     * })
     */
    upsert<T extends CaseVoteUpsertArgs>(args: SelectSubset<T, CaseVoteUpsertArgs<ExtArgs>>): Prisma__CaseVoteClient<$Result.GetResult<Prisma.$CaseVotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CaseVotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseVoteCountArgs} args - Arguments to filter CaseVotes to count.
     * @example
     * // Count the number of CaseVotes
     * const count = await prisma.caseVote.count({
     *   where: {
     *     // ... the filter for the CaseVotes we want to count
     *   }
     * })
    **/
    count<T extends CaseVoteCountArgs>(
      args?: Subset<T, CaseVoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CaseVoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CaseVote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseVoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CaseVoteAggregateArgs>(args: Subset<T, CaseVoteAggregateArgs>): Prisma.PrismaPromise<GetCaseVoteAggregateType<T>>

    /**
     * Group by CaseVote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CaseVoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CaseVoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CaseVoteGroupByArgs['orderBy'] }
        : { orderBy?: CaseVoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CaseVoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCaseVoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CaseVote model
   */
  readonly fields: CaseVoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CaseVote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CaseVoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    case<T extends JuryCaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JuryCaseDefaultArgs<ExtArgs>>): Prisma__JuryCaseClient<$Result.GetResult<Prisma.$JuryCasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CaseVote model
   */
  interface CaseVoteFieldRefs {
    readonly id: FieldRef<"CaseVote", 'Int'>
    readonly caseId: FieldRef<"CaseVote", 'Int'>
    readonly jurorAddr: FieldRef<"CaseVote", 'String'>
    readonly vote: FieldRef<"CaseVote", 'String'>
    readonly timestamp: FieldRef<"CaseVote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CaseVote findUnique
   */
  export type CaseVoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
    /**
     * Filter, which CaseVote to fetch.
     */
    where: CaseVoteWhereUniqueInput
  }

  /**
   * CaseVote findUniqueOrThrow
   */
  export type CaseVoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
    /**
     * Filter, which CaseVote to fetch.
     */
    where: CaseVoteWhereUniqueInput
  }

  /**
   * CaseVote findFirst
   */
  export type CaseVoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
    /**
     * Filter, which CaseVote to fetch.
     */
    where?: CaseVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseVotes to fetch.
     */
    orderBy?: CaseVoteOrderByWithRelationInput | CaseVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseVotes.
     */
    cursor?: CaseVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseVotes.
     */
    distinct?: CaseVoteScalarFieldEnum | CaseVoteScalarFieldEnum[]
  }

  /**
   * CaseVote findFirstOrThrow
   */
  export type CaseVoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
    /**
     * Filter, which CaseVote to fetch.
     */
    where?: CaseVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseVotes to fetch.
     */
    orderBy?: CaseVoteOrderByWithRelationInput | CaseVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CaseVotes.
     */
    cursor?: CaseVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseVotes.
     */
    distinct?: CaseVoteScalarFieldEnum | CaseVoteScalarFieldEnum[]
  }

  /**
   * CaseVote findMany
   */
  export type CaseVoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
    /**
     * Filter, which CaseVotes to fetch.
     */
    where?: CaseVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CaseVotes to fetch.
     */
    orderBy?: CaseVoteOrderByWithRelationInput | CaseVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CaseVotes.
     */
    cursor?: CaseVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CaseVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CaseVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CaseVotes.
     */
    distinct?: CaseVoteScalarFieldEnum | CaseVoteScalarFieldEnum[]
  }

  /**
   * CaseVote create
   */
  export type CaseVoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
    /**
     * The data needed to create a CaseVote.
     */
    data: XOR<CaseVoteCreateInput, CaseVoteUncheckedCreateInput>
  }

  /**
   * CaseVote createMany
   */
  export type CaseVoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CaseVotes.
     */
    data: CaseVoteCreateManyInput | CaseVoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CaseVote createManyAndReturn
   */
  export type CaseVoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * The data used to create many CaseVotes.
     */
    data: CaseVoteCreateManyInput | CaseVoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseVote update
   */
  export type CaseVoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
    /**
     * The data needed to update a CaseVote.
     */
    data: XOR<CaseVoteUpdateInput, CaseVoteUncheckedUpdateInput>
    /**
     * Choose, which CaseVote to update.
     */
    where: CaseVoteWhereUniqueInput
  }

  /**
   * CaseVote updateMany
   */
  export type CaseVoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CaseVotes.
     */
    data: XOR<CaseVoteUpdateManyMutationInput, CaseVoteUncheckedUpdateManyInput>
    /**
     * Filter which CaseVotes to update
     */
    where?: CaseVoteWhereInput
    /**
     * Limit how many CaseVotes to update.
     */
    limit?: number
  }

  /**
   * CaseVote updateManyAndReturn
   */
  export type CaseVoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * The data used to update CaseVotes.
     */
    data: XOR<CaseVoteUpdateManyMutationInput, CaseVoteUncheckedUpdateManyInput>
    /**
     * Filter which CaseVotes to update
     */
    where?: CaseVoteWhereInput
    /**
     * Limit how many CaseVotes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CaseVote upsert
   */
  export type CaseVoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
    /**
     * The filter to search for the CaseVote to update in case it exists.
     */
    where: CaseVoteWhereUniqueInput
    /**
     * In case the CaseVote found by the `where` argument doesn't exist, create a new CaseVote with this data.
     */
    create: XOR<CaseVoteCreateInput, CaseVoteUncheckedCreateInput>
    /**
     * In case the CaseVote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CaseVoteUpdateInput, CaseVoteUncheckedUpdateInput>
  }

  /**
   * CaseVote delete
   */
  export type CaseVoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
    /**
     * Filter which CaseVote to delete.
     */
    where: CaseVoteWhereUniqueInput
  }

  /**
   * CaseVote deleteMany
   */
  export type CaseVoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CaseVotes to delete
     */
    where?: CaseVoteWhereInput
    /**
     * Limit how many CaseVotes to delete.
     */
    limit?: number
  }

  /**
   * CaseVote without action
   */
  export type CaseVoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CaseVote
     */
    select?: CaseVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CaseVote
     */
    omit?: CaseVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CaseVoteInclude<ExtArgs> | null
  }


  /**
   * Model Juror
   */

  export type AggregateJuror = {
    _count: JurorCountAggregateOutputType | null
    _avg: JurorAvgAggregateOutputType | null
    _sum: JurorSumAggregateOutputType | null
    _min: JurorMinAggregateOutputType | null
    _max: JurorMaxAggregateOutputType | null
  }

  export type JurorAvgAggregateOutputType = {
    id: number | null
    xlmStake: number | null
    platformStake: number | null
  }

  export type JurorSumAggregateOutputType = {
    id: number | null
    xlmStake: bigint | null
    platformStake: bigint | null
  }

  export type JurorMinAggregateOutputType = {
    id: number | null
    address: string | null
    xlmStake: bigint | null
    platformStake: bigint | null
    registeredAt: Date | null
    isActive: boolean | null
  }

  export type JurorMaxAggregateOutputType = {
    id: number | null
    address: string | null
    xlmStake: bigint | null
    platformStake: bigint | null
    registeredAt: Date | null
    isActive: boolean | null
  }

  export type JurorCountAggregateOutputType = {
    id: number
    address: number
    xlmStake: number
    platformStake: number
    registeredAt: number
    isActive: number
    _all: number
  }


  export type JurorAvgAggregateInputType = {
    id?: true
    xlmStake?: true
    platformStake?: true
  }

  export type JurorSumAggregateInputType = {
    id?: true
    xlmStake?: true
    platformStake?: true
  }

  export type JurorMinAggregateInputType = {
    id?: true
    address?: true
    xlmStake?: true
    platformStake?: true
    registeredAt?: true
    isActive?: true
  }

  export type JurorMaxAggregateInputType = {
    id?: true
    address?: true
    xlmStake?: true
    platformStake?: true
    registeredAt?: true
    isActive?: true
  }

  export type JurorCountAggregateInputType = {
    id?: true
    address?: true
    xlmStake?: true
    platformStake?: true
    registeredAt?: true
    isActive?: true
    _all?: true
  }

  export type JurorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Juror to aggregate.
     */
    where?: JurorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jurors to fetch.
     */
    orderBy?: JurorOrderByWithRelationInput | JurorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JurorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jurors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jurors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jurors
    **/
    _count?: true | JurorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JurorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JurorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JurorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JurorMaxAggregateInputType
  }

  export type GetJurorAggregateType<T extends JurorAggregateArgs> = {
        [P in keyof T & keyof AggregateJuror]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJuror[P]>
      : GetScalarType<T[P], AggregateJuror[P]>
  }




  export type JurorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JurorWhereInput
    orderBy?: JurorOrderByWithAggregationInput | JurorOrderByWithAggregationInput[]
    by: JurorScalarFieldEnum[] | JurorScalarFieldEnum
    having?: JurorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JurorCountAggregateInputType | true
    _avg?: JurorAvgAggregateInputType
    _sum?: JurorSumAggregateInputType
    _min?: JurorMinAggregateInputType
    _max?: JurorMaxAggregateInputType
  }

  export type JurorGroupByOutputType = {
    id: number
    address: string
    xlmStake: bigint
    platformStake: bigint
    registeredAt: Date
    isActive: boolean
    _count: JurorCountAggregateOutputType | null
    _avg: JurorAvgAggregateOutputType | null
    _sum: JurorSumAggregateOutputType | null
    _min: JurorMinAggregateOutputType | null
    _max: JurorMaxAggregateOutputType | null
  }

  type GetJurorGroupByPayload<T extends JurorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JurorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JurorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JurorGroupByOutputType[P]>
            : GetScalarType<T[P], JurorGroupByOutputType[P]>
        }
      >
    >


  export type JurorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    xlmStake?: boolean
    platformStake?: boolean
    registeredAt?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["juror"]>

  export type JurorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    xlmStake?: boolean
    platformStake?: boolean
    registeredAt?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["juror"]>

  export type JurorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    xlmStake?: boolean
    platformStake?: boolean
    registeredAt?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["juror"]>

  export type JurorSelectScalar = {
    id?: boolean
    address?: boolean
    xlmStake?: boolean
    platformStake?: boolean
    registeredAt?: boolean
    isActive?: boolean
  }

  export type JurorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "address" | "xlmStake" | "platformStake" | "registeredAt" | "isActive", ExtArgs["result"]["juror"]>

  export type $JurorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Juror"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      address: string
      xlmStake: bigint
      platformStake: bigint
      registeredAt: Date
      isActive: boolean
    }, ExtArgs["result"]["juror"]>
    composites: {}
  }

  type JurorGetPayload<S extends boolean | null | undefined | JurorDefaultArgs> = $Result.GetResult<Prisma.$JurorPayload, S>

  type JurorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JurorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JurorCountAggregateInputType | true
    }

  export interface JurorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Juror'], meta: { name: 'Juror' } }
    /**
     * Find zero or one Juror that matches the filter.
     * @param {JurorFindUniqueArgs} args - Arguments to find a Juror
     * @example
     * // Get one Juror
     * const juror = await prisma.juror.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JurorFindUniqueArgs>(args: SelectSubset<T, JurorFindUniqueArgs<ExtArgs>>): Prisma__JurorClient<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Juror that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JurorFindUniqueOrThrowArgs} args - Arguments to find a Juror
     * @example
     * // Get one Juror
     * const juror = await prisma.juror.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JurorFindUniqueOrThrowArgs>(args: SelectSubset<T, JurorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JurorClient<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Juror that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurorFindFirstArgs} args - Arguments to find a Juror
     * @example
     * // Get one Juror
     * const juror = await prisma.juror.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JurorFindFirstArgs>(args?: SelectSubset<T, JurorFindFirstArgs<ExtArgs>>): Prisma__JurorClient<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Juror that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurorFindFirstOrThrowArgs} args - Arguments to find a Juror
     * @example
     * // Get one Juror
     * const juror = await prisma.juror.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JurorFindFirstOrThrowArgs>(args?: SelectSubset<T, JurorFindFirstOrThrowArgs<ExtArgs>>): Prisma__JurorClient<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Jurors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jurors
     * const jurors = await prisma.juror.findMany()
     * 
     * // Get first 10 Jurors
     * const jurors = await prisma.juror.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jurorWithIdOnly = await prisma.juror.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JurorFindManyArgs>(args?: SelectSubset<T, JurorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Juror.
     * @param {JurorCreateArgs} args - Arguments to create a Juror.
     * @example
     * // Create one Juror
     * const Juror = await prisma.juror.create({
     *   data: {
     *     // ... data to create a Juror
     *   }
     * })
     * 
     */
    create<T extends JurorCreateArgs>(args: SelectSubset<T, JurorCreateArgs<ExtArgs>>): Prisma__JurorClient<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Jurors.
     * @param {JurorCreateManyArgs} args - Arguments to create many Jurors.
     * @example
     * // Create many Jurors
     * const juror = await prisma.juror.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JurorCreateManyArgs>(args?: SelectSubset<T, JurorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jurors and returns the data saved in the database.
     * @param {JurorCreateManyAndReturnArgs} args - Arguments to create many Jurors.
     * @example
     * // Create many Jurors
     * const juror = await prisma.juror.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jurors and only return the `id`
     * const jurorWithIdOnly = await prisma.juror.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JurorCreateManyAndReturnArgs>(args?: SelectSubset<T, JurorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Juror.
     * @param {JurorDeleteArgs} args - Arguments to delete one Juror.
     * @example
     * // Delete one Juror
     * const Juror = await prisma.juror.delete({
     *   where: {
     *     // ... filter to delete one Juror
     *   }
     * })
     * 
     */
    delete<T extends JurorDeleteArgs>(args: SelectSubset<T, JurorDeleteArgs<ExtArgs>>): Prisma__JurorClient<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Juror.
     * @param {JurorUpdateArgs} args - Arguments to update one Juror.
     * @example
     * // Update one Juror
     * const juror = await prisma.juror.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JurorUpdateArgs>(args: SelectSubset<T, JurorUpdateArgs<ExtArgs>>): Prisma__JurorClient<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Jurors.
     * @param {JurorDeleteManyArgs} args - Arguments to filter Jurors to delete.
     * @example
     * // Delete a few Jurors
     * const { count } = await prisma.juror.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JurorDeleteManyArgs>(args?: SelectSubset<T, JurorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jurors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jurors
     * const juror = await prisma.juror.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JurorUpdateManyArgs>(args: SelectSubset<T, JurorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jurors and returns the data updated in the database.
     * @param {JurorUpdateManyAndReturnArgs} args - Arguments to update many Jurors.
     * @example
     * // Update many Jurors
     * const juror = await prisma.juror.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Jurors and only return the `id`
     * const jurorWithIdOnly = await prisma.juror.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JurorUpdateManyAndReturnArgs>(args: SelectSubset<T, JurorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Juror.
     * @param {JurorUpsertArgs} args - Arguments to update or create a Juror.
     * @example
     * // Update or create a Juror
     * const juror = await prisma.juror.upsert({
     *   create: {
     *     // ... data to create a Juror
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Juror we want to update
     *   }
     * })
     */
    upsert<T extends JurorUpsertArgs>(args: SelectSubset<T, JurorUpsertArgs<ExtArgs>>): Prisma__JurorClient<$Result.GetResult<Prisma.$JurorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Jurors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurorCountArgs} args - Arguments to filter Jurors to count.
     * @example
     * // Count the number of Jurors
     * const count = await prisma.juror.count({
     *   where: {
     *     // ... the filter for the Jurors we want to count
     *   }
     * })
    **/
    count<T extends JurorCountArgs>(
      args?: Subset<T, JurorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JurorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Juror.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JurorAggregateArgs>(args: Subset<T, JurorAggregateArgs>): Prisma.PrismaPromise<GetJurorAggregateType<T>>

    /**
     * Group by Juror.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JurorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JurorGroupByArgs['orderBy'] }
        : { orderBy?: JurorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JurorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJurorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Juror model
   */
  readonly fields: JurorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Juror.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JurorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Juror model
   */
  interface JurorFieldRefs {
    readonly id: FieldRef<"Juror", 'Int'>
    readonly address: FieldRef<"Juror", 'String'>
    readonly xlmStake: FieldRef<"Juror", 'BigInt'>
    readonly platformStake: FieldRef<"Juror", 'BigInt'>
    readonly registeredAt: FieldRef<"Juror", 'DateTime'>
    readonly isActive: FieldRef<"Juror", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Juror findUnique
   */
  export type JurorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * Filter, which Juror to fetch.
     */
    where: JurorWhereUniqueInput
  }

  /**
   * Juror findUniqueOrThrow
   */
  export type JurorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * Filter, which Juror to fetch.
     */
    where: JurorWhereUniqueInput
  }

  /**
   * Juror findFirst
   */
  export type JurorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * Filter, which Juror to fetch.
     */
    where?: JurorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jurors to fetch.
     */
    orderBy?: JurorOrderByWithRelationInput | JurorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jurors.
     */
    cursor?: JurorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jurors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jurors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jurors.
     */
    distinct?: JurorScalarFieldEnum | JurorScalarFieldEnum[]
  }

  /**
   * Juror findFirstOrThrow
   */
  export type JurorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * Filter, which Juror to fetch.
     */
    where?: JurorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jurors to fetch.
     */
    orderBy?: JurorOrderByWithRelationInput | JurorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jurors.
     */
    cursor?: JurorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jurors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jurors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jurors.
     */
    distinct?: JurorScalarFieldEnum | JurorScalarFieldEnum[]
  }

  /**
   * Juror findMany
   */
  export type JurorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * Filter, which Jurors to fetch.
     */
    where?: JurorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jurors to fetch.
     */
    orderBy?: JurorOrderByWithRelationInput | JurorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jurors.
     */
    cursor?: JurorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jurors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jurors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jurors.
     */
    distinct?: JurorScalarFieldEnum | JurorScalarFieldEnum[]
  }

  /**
   * Juror create
   */
  export type JurorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * The data needed to create a Juror.
     */
    data: XOR<JurorCreateInput, JurorUncheckedCreateInput>
  }

  /**
   * Juror createMany
   */
  export type JurorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jurors.
     */
    data: JurorCreateManyInput | JurorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Juror createManyAndReturn
   */
  export type JurorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * The data used to create many Jurors.
     */
    data: JurorCreateManyInput | JurorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Juror update
   */
  export type JurorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * The data needed to update a Juror.
     */
    data: XOR<JurorUpdateInput, JurorUncheckedUpdateInput>
    /**
     * Choose, which Juror to update.
     */
    where: JurorWhereUniqueInput
  }

  /**
   * Juror updateMany
   */
  export type JurorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jurors.
     */
    data: XOR<JurorUpdateManyMutationInput, JurorUncheckedUpdateManyInput>
    /**
     * Filter which Jurors to update
     */
    where?: JurorWhereInput
    /**
     * Limit how many Jurors to update.
     */
    limit?: number
  }

  /**
   * Juror updateManyAndReturn
   */
  export type JurorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * The data used to update Jurors.
     */
    data: XOR<JurorUpdateManyMutationInput, JurorUncheckedUpdateManyInput>
    /**
     * Filter which Jurors to update
     */
    where?: JurorWhereInput
    /**
     * Limit how many Jurors to update.
     */
    limit?: number
  }

  /**
   * Juror upsert
   */
  export type JurorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * The filter to search for the Juror to update in case it exists.
     */
    where: JurorWhereUniqueInput
    /**
     * In case the Juror found by the `where` argument doesn't exist, create a new Juror with this data.
     */
    create: XOR<JurorCreateInput, JurorUncheckedCreateInput>
    /**
     * In case the Juror was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JurorUpdateInput, JurorUncheckedUpdateInput>
  }

  /**
   * Juror delete
   */
  export type JurorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
    /**
     * Filter which Juror to delete.
     */
    where: JurorWhereUniqueInput
  }

  /**
   * Juror deleteMany
   */
  export type JurorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jurors to delete
     */
    where?: JurorWhereInput
    /**
     * Limit how many Jurors to delete.
     */
    limit?: number
  }

  /**
   * Juror without action
   */
  export type JurorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Juror
     */
    select?: JurorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Juror
     */
    omit?: JurorOmit<ExtArgs> | null
  }


  /**
   * Model Identity
   */

  export type AggregateIdentity = {
    _count: IdentityCountAggregateOutputType | null
    _avg: IdentityAvgAggregateOutputType | null
    _sum: IdentitySumAggregateOutputType | null
    _min: IdentityMinAggregateOutputType | null
    _max: IdentityMaxAggregateOutputType | null
  }

  export type IdentityAvgAggregateOutputType = {
    id: number | null
    linkedCaseId: number | null
  }

  export type IdentitySumAggregateOutputType = {
    id: number | null
    linkedCaseId: number | null
  }

  export type IdentityMinAggregateOutputType = {
    id: number | null
    identityId: string | null
    commitmentHash: string | null
    isCommitted: boolean | null
    isRevealed: boolean | null
    linkedCaseId: number | null
    backendRef: string | null
    revealedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IdentityMaxAggregateOutputType = {
    id: number | null
    identityId: string | null
    commitmentHash: string | null
    isCommitted: boolean | null
    isRevealed: boolean | null
    linkedCaseId: number | null
    backendRef: string | null
    revealedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IdentityCountAggregateOutputType = {
    id: number
    identityId: number
    commitmentHash: number
    isCommitted: number
    isRevealed: number
    linkedCaseId: number
    backendRef: number
    revealedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type IdentityAvgAggregateInputType = {
    id?: true
    linkedCaseId?: true
  }

  export type IdentitySumAggregateInputType = {
    id?: true
    linkedCaseId?: true
  }

  export type IdentityMinAggregateInputType = {
    id?: true
    identityId?: true
    commitmentHash?: true
    isCommitted?: true
    isRevealed?: true
    linkedCaseId?: true
    backendRef?: true
    revealedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IdentityMaxAggregateInputType = {
    id?: true
    identityId?: true
    commitmentHash?: true
    isCommitted?: true
    isRevealed?: true
    linkedCaseId?: true
    backendRef?: true
    revealedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IdentityCountAggregateInputType = {
    id?: true
    identityId?: true
    commitmentHash?: true
    isCommitted?: true
    isRevealed?: true
    linkedCaseId?: true
    backendRef?: true
    revealedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type IdentityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Identity to aggregate.
     */
    where?: IdentityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Identities to fetch.
     */
    orderBy?: IdentityOrderByWithRelationInput | IdentityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IdentityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Identities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Identities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Identities
    **/
    _count?: true | IdentityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IdentityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IdentitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IdentityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IdentityMaxAggregateInputType
  }

  export type GetIdentityAggregateType<T extends IdentityAggregateArgs> = {
        [P in keyof T & keyof AggregateIdentity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIdentity[P]>
      : GetScalarType<T[P], AggregateIdentity[P]>
  }




  export type IdentityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IdentityWhereInput
    orderBy?: IdentityOrderByWithAggregationInput | IdentityOrderByWithAggregationInput[]
    by: IdentityScalarFieldEnum[] | IdentityScalarFieldEnum
    having?: IdentityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IdentityCountAggregateInputType | true
    _avg?: IdentityAvgAggregateInputType
    _sum?: IdentitySumAggregateInputType
    _min?: IdentityMinAggregateInputType
    _max?: IdentityMaxAggregateInputType
  }

  export type IdentityGroupByOutputType = {
    id: number
    identityId: string
    commitmentHash: string | null
    isCommitted: boolean
    isRevealed: boolean
    linkedCaseId: number | null
    backendRef: string | null
    revealedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: IdentityCountAggregateOutputType | null
    _avg: IdentityAvgAggregateOutputType | null
    _sum: IdentitySumAggregateOutputType | null
    _min: IdentityMinAggregateOutputType | null
    _max: IdentityMaxAggregateOutputType | null
  }

  type GetIdentityGroupByPayload<T extends IdentityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IdentityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IdentityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IdentityGroupByOutputType[P]>
            : GetScalarType<T[P], IdentityGroupByOutputType[P]>
        }
      >
    >


  export type IdentitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identityId?: boolean
    commitmentHash?: boolean
    isCommitted?: boolean
    isRevealed?: boolean
    linkedCaseId?: boolean
    backendRef?: boolean
    revealedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["identity"]>

  export type IdentitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identityId?: boolean
    commitmentHash?: boolean
    isCommitted?: boolean
    isRevealed?: boolean
    linkedCaseId?: boolean
    backendRef?: boolean
    revealedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["identity"]>

  export type IdentitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identityId?: boolean
    commitmentHash?: boolean
    isCommitted?: boolean
    isRevealed?: boolean
    linkedCaseId?: boolean
    backendRef?: boolean
    revealedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["identity"]>

  export type IdentitySelectScalar = {
    id?: boolean
    identityId?: boolean
    commitmentHash?: boolean
    isCommitted?: boolean
    isRevealed?: boolean
    linkedCaseId?: boolean
    backendRef?: boolean
    revealedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type IdentityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identityId" | "commitmentHash" | "isCommitted" | "isRevealed" | "linkedCaseId" | "backendRef" | "revealedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["identity"]>

  export type $IdentityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Identity"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      identityId: string
      commitmentHash: string | null
      isCommitted: boolean
      isRevealed: boolean
      linkedCaseId: number | null
      backendRef: string | null
      revealedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["identity"]>
    composites: {}
  }

  type IdentityGetPayload<S extends boolean | null | undefined | IdentityDefaultArgs> = $Result.GetResult<Prisma.$IdentityPayload, S>

  type IdentityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IdentityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IdentityCountAggregateInputType | true
    }

  export interface IdentityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Identity'], meta: { name: 'Identity' } }
    /**
     * Find zero or one Identity that matches the filter.
     * @param {IdentityFindUniqueArgs} args - Arguments to find a Identity
     * @example
     * // Get one Identity
     * const identity = await prisma.identity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IdentityFindUniqueArgs>(args: SelectSubset<T, IdentityFindUniqueArgs<ExtArgs>>): Prisma__IdentityClient<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Identity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IdentityFindUniqueOrThrowArgs} args - Arguments to find a Identity
     * @example
     * // Get one Identity
     * const identity = await prisma.identity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IdentityFindUniqueOrThrowArgs>(args: SelectSubset<T, IdentityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IdentityClient<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Identity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityFindFirstArgs} args - Arguments to find a Identity
     * @example
     * // Get one Identity
     * const identity = await prisma.identity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IdentityFindFirstArgs>(args?: SelectSubset<T, IdentityFindFirstArgs<ExtArgs>>): Prisma__IdentityClient<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Identity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityFindFirstOrThrowArgs} args - Arguments to find a Identity
     * @example
     * // Get one Identity
     * const identity = await prisma.identity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IdentityFindFirstOrThrowArgs>(args?: SelectSubset<T, IdentityFindFirstOrThrowArgs<ExtArgs>>): Prisma__IdentityClient<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Identities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Identities
     * const identities = await prisma.identity.findMany()
     * 
     * // Get first 10 Identities
     * const identities = await prisma.identity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const identityWithIdOnly = await prisma.identity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IdentityFindManyArgs>(args?: SelectSubset<T, IdentityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Identity.
     * @param {IdentityCreateArgs} args - Arguments to create a Identity.
     * @example
     * // Create one Identity
     * const Identity = await prisma.identity.create({
     *   data: {
     *     // ... data to create a Identity
     *   }
     * })
     * 
     */
    create<T extends IdentityCreateArgs>(args: SelectSubset<T, IdentityCreateArgs<ExtArgs>>): Prisma__IdentityClient<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Identities.
     * @param {IdentityCreateManyArgs} args - Arguments to create many Identities.
     * @example
     * // Create many Identities
     * const identity = await prisma.identity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IdentityCreateManyArgs>(args?: SelectSubset<T, IdentityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Identities and returns the data saved in the database.
     * @param {IdentityCreateManyAndReturnArgs} args - Arguments to create many Identities.
     * @example
     * // Create many Identities
     * const identity = await prisma.identity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Identities and only return the `id`
     * const identityWithIdOnly = await prisma.identity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IdentityCreateManyAndReturnArgs>(args?: SelectSubset<T, IdentityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Identity.
     * @param {IdentityDeleteArgs} args - Arguments to delete one Identity.
     * @example
     * // Delete one Identity
     * const Identity = await prisma.identity.delete({
     *   where: {
     *     // ... filter to delete one Identity
     *   }
     * })
     * 
     */
    delete<T extends IdentityDeleteArgs>(args: SelectSubset<T, IdentityDeleteArgs<ExtArgs>>): Prisma__IdentityClient<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Identity.
     * @param {IdentityUpdateArgs} args - Arguments to update one Identity.
     * @example
     * // Update one Identity
     * const identity = await prisma.identity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IdentityUpdateArgs>(args: SelectSubset<T, IdentityUpdateArgs<ExtArgs>>): Prisma__IdentityClient<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Identities.
     * @param {IdentityDeleteManyArgs} args - Arguments to filter Identities to delete.
     * @example
     * // Delete a few Identities
     * const { count } = await prisma.identity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IdentityDeleteManyArgs>(args?: SelectSubset<T, IdentityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Identities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Identities
     * const identity = await prisma.identity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IdentityUpdateManyArgs>(args: SelectSubset<T, IdentityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Identities and returns the data updated in the database.
     * @param {IdentityUpdateManyAndReturnArgs} args - Arguments to update many Identities.
     * @example
     * // Update many Identities
     * const identity = await prisma.identity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Identities and only return the `id`
     * const identityWithIdOnly = await prisma.identity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IdentityUpdateManyAndReturnArgs>(args: SelectSubset<T, IdentityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Identity.
     * @param {IdentityUpsertArgs} args - Arguments to update or create a Identity.
     * @example
     * // Update or create a Identity
     * const identity = await prisma.identity.upsert({
     *   create: {
     *     // ... data to create a Identity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Identity we want to update
     *   }
     * })
     */
    upsert<T extends IdentityUpsertArgs>(args: SelectSubset<T, IdentityUpsertArgs<ExtArgs>>): Prisma__IdentityClient<$Result.GetResult<Prisma.$IdentityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Identities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityCountArgs} args - Arguments to filter Identities to count.
     * @example
     * // Count the number of Identities
     * const count = await prisma.identity.count({
     *   where: {
     *     // ... the filter for the Identities we want to count
     *   }
     * })
    **/
    count<T extends IdentityCountArgs>(
      args?: Subset<T, IdentityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IdentityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Identity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IdentityAggregateArgs>(args: Subset<T, IdentityAggregateArgs>): Prisma.PrismaPromise<GetIdentityAggregateType<T>>

    /**
     * Group by Identity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IdentityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IdentityGroupByArgs['orderBy'] }
        : { orderBy?: IdentityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IdentityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIdentityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Identity model
   */
  readonly fields: IdentityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Identity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IdentityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Identity model
   */
  interface IdentityFieldRefs {
    readonly id: FieldRef<"Identity", 'Int'>
    readonly identityId: FieldRef<"Identity", 'String'>
    readonly commitmentHash: FieldRef<"Identity", 'String'>
    readonly isCommitted: FieldRef<"Identity", 'Boolean'>
    readonly isRevealed: FieldRef<"Identity", 'Boolean'>
    readonly linkedCaseId: FieldRef<"Identity", 'Int'>
    readonly backendRef: FieldRef<"Identity", 'String'>
    readonly revealedAt: FieldRef<"Identity", 'DateTime'>
    readonly createdAt: FieldRef<"Identity", 'DateTime'>
    readonly updatedAt: FieldRef<"Identity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Identity findUnique
   */
  export type IdentityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * Filter, which Identity to fetch.
     */
    where: IdentityWhereUniqueInput
  }

  /**
   * Identity findUniqueOrThrow
   */
  export type IdentityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * Filter, which Identity to fetch.
     */
    where: IdentityWhereUniqueInput
  }

  /**
   * Identity findFirst
   */
  export type IdentityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * Filter, which Identity to fetch.
     */
    where?: IdentityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Identities to fetch.
     */
    orderBy?: IdentityOrderByWithRelationInput | IdentityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Identities.
     */
    cursor?: IdentityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Identities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Identities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Identities.
     */
    distinct?: IdentityScalarFieldEnum | IdentityScalarFieldEnum[]
  }

  /**
   * Identity findFirstOrThrow
   */
  export type IdentityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * Filter, which Identity to fetch.
     */
    where?: IdentityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Identities to fetch.
     */
    orderBy?: IdentityOrderByWithRelationInput | IdentityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Identities.
     */
    cursor?: IdentityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Identities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Identities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Identities.
     */
    distinct?: IdentityScalarFieldEnum | IdentityScalarFieldEnum[]
  }

  /**
   * Identity findMany
   */
  export type IdentityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * Filter, which Identities to fetch.
     */
    where?: IdentityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Identities to fetch.
     */
    orderBy?: IdentityOrderByWithRelationInput | IdentityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Identities.
     */
    cursor?: IdentityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Identities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Identities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Identities.
     */
    distinct?: IdentityScalarFieldEnum | IdentityScalarFieldEnum[]
  }

  /**
   * Identity create
   */
  export type IdentityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * The data needed to create a Identity.
     */
    data: XOR<IdentityCreateInput, IdentityUncheckedCreateInput>
  }

  /**
   * Identity createMany
   */
  export type IdentityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Identities.
     */
    data: IdentityCreateManyInput | IdentityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Identity createManyAndReturn
   */
  export type IdentityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * The data used to create many Identities.
     */
    data: IdentityCreateManyInput | IdentityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Identity update
   */
  export type IdentityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * The data needed to update a Identity.
     */
    data: XOR<IdentityUpdateInput, IdentityUncheckedUpdateInput>
    /**
     * Choose, which Identity to update.
     */
    where: IdentityWhereUniqueInput
  }

  /**
   * Identity updateMany
   */
  export type IdentityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Identities.
     */
    data: XOR<IdentityUpdateManyMutationInput, IdentityUncheckedUpdateManyInput>
    /**
     * Filter which Identities to update
     */
    where?: IdentityWhereInput
    /**
     * Limit how many Identities to update.
     */
    limit?: number
  }

  /**
   * Identity updateManyAndReturn
   */
  export type IdentityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * The data used to update Identities.
     */
    data: XOR<IdentityUpdateManyMutationInput, IdentityUncheckedUpdateManyInput>
    /**
     * Filter which Identities to update
     */
    where?: IdentityWhereInput
    /**
     * Limit how many Identities to update.
     */
    limit?: number
  }

  /**
   * Identity upsert
   */
  export type IdentityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * The filter to search for the Identity to update in case it exists.
     */
    where: IdentityWhereUniqueInput
    /**
     * In case the Identity found by the `where` argument doesn't exist, create a new Identity with this data.
     */
    create: XOR<IdentityCreateInput, IdentityUncheckedCreateInput>
    /**
     * In case the Identity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IdentityUpdateInput, IdentityUncheckedUpdateInput>
  }

  /**
   * Identity delete
   */
  export type IdentityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
    /**
     * Filter which Identity to delete.
     */
    where: IdentityWhereUniqueInput
  }

  /**
   * Identity deleteMany
   */
  export type IdentityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Identities to delete
     */
    where?: IdentityWhereInput
    /**
     * Limit how many Identities to delete.
     */
    limit?: number
  }

  /**
   * Identity without action
   */
  export type IdentityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Identity
     */
    select?: IdentitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Identity
     */
    omit?: IdentityOmit<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    wallet: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    wallet: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    wallet: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    wallet?: true
    expiresAt?: true
    createdAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    wallet?: true
    expiresAt?: true
    createdAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    wallet?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    wallet: string
    expiresAt: Date
    createdAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wallet?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wallet?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wallet?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    wallet?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "wallet" | "expiresAt" | "createdAt", ExtArgs["result"]["session"]>

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      wallet: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly wallet: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    wallet: string | null
    type: string | null
    title: string | null
    body: string | null
    read: boolean | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    wallet: string | null
    type: string | null
    title: string | null
    body: string | null
    read: boolean | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    wallet: number
    type: number
    title: number
    body: number
    read: number
    data: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    wallet?: true
    type?: true
    title?: true
    body?: true
    read?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    wallet?: true
    type?: true
    title?: true
    body?: true
    read?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    wallet?: true
    type?: true
    title?: true
    body?: true
    read?: true
    data?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    wallet: string
    type: string
    title: string
    body: string
    read: boolean
    data: JsonValue | null
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wallet?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    read?: boolean
    data?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wallet?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    read?: boolean
    data?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wallet?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    read?: boolean
    data?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    wallet?: boolean
    type?: boolean
    title?: boolean
    body?: boolean
    read?: boolean
    data?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "wallet" | "type" | "title" | "body" | "read" | "data" | "createdAt", ExtArgs["result"]["notification"]>

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      wallet: string
      type: string
      title: string
      body: string
      read: boolean
      data: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly wallet: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly body: FieldRef<"Notification", 'String'>
    readonly read: FieldRef<"Notification", 'Boolean'>
    readonly data: FieldRef<"Notification", 'Json'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
  }


  /**
   * Model IndexerCursor
   */

  export type AggregateIndexerCursor = {
    _count: IndexerCursorCountAggregateOutputType | null
    _avg: IndexerCursorAvgAggregateOutputType | null
    _sum: IndexerCursorSumAggregateOutputType | null
    _min: IndexerCursorMinAggregateOutputType | null
    _max: IndexerCursorMaxAggregateOutputType | null
  }

  export type IndexerCursorAvgAggregateOutputType = {
    lastLedgerSeq: number | null
  }

  export type IndexerCursorSumAggregateOutputType = {
    lastLedgerSeq: number | null
  }

  export type IndexerCursorMinAggregateOutputType = {
    id: string | null
    lastLedgerSeq: number | null
    updatedAt: Date | null
  }

  export type IndexerCursorMaxAggregateOutputType = {
    id: string | null
    lastLedgerSeq: number | null
    updatedAt: Date | null
  }

  export type IndexerCursorCountAggregateOutputType = {
    id: number
    lastLedgerSeq: number
    updatedAt: number
    _all: number
  }


  export type IndexerCursorAvgAggregateInputType = {
    lastLedgerSeq?: true
  }

  export type IndexerCursorSumAggregateInputType = {
    lastLedgerSeq?: true
  }

  export type IndexerCursorMinAggregateInputType = {
    id?: true
    lastLedgerSeq?: true
    updatedAt?: true
  }

  export type IndexerCursorMaxAggregateInputType = {
    id?: true
    lastLedgerSeq?: true
    updatedAt?: true
  }

  export type IndexerCursorCountAggregateInputType = {
    id?: true
    lastLedgerSeq?: true
    updatedAt?: true
    _all?: true
  }

  export type IndexerCursorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IndexerCursor to aggregate.
     */
    where?: IndexerCursorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexerCursors to fetch.
     */
    orderBy?: IndexerCursorOrderByWithRelationInput | IndexerCursorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IndexerCursorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexerCursors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexerCursors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IndexerCursors
    **/
    _count?: true | IndexerCursorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IndexerCursorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IndexerCursorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IndexerCursorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IndexerCursorMaxAggregateInputType
  }

  export type GetIndexerCursorAggregateType<T extends IndexerCursorAggregateArgs> = {
        [P in keyof T & keyof AggregateIndexerCursor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIndexerCursor[P]>
      : GetScalarType<T[P], AggregateIndexerCursor[P]>
  }




  export type IndexerCursorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IndexerCursorWhereInput
    orderBy?: IndexerCursorOrderByWithAggregationInput | IndexerCursorOrderByWithAggregationInput[]
    by: IndexerCursorScalarFieldEnum[] | IndexerCursorScalarFieldEnum
    having?: IndexerCursorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IndexerCursorCountAggregateInputType | true
    _avg?: IndexerCursorAvgAggregateInputType
    _sum?: IndexerCursorSumAggregateInputType
    _min?: IndexerCursorMinAggregateInputType
    _max?: IndexerCursorMaxAggregateInputType
  }

  export type IndexerCursorGroupByOutputType = {
    id: string
    lastLedgerSeq: number
    updatedAt: Date
    _count: IndexerCursorCountAggregateOutputType | null
    _avg: IndexerCursorAvgAggregateOutputType | null
    _sum: IndexerCursorSumAggregateOutputType | null
    _min: IndexerCursorMinAggregateOutputType | null
    _max: IndexerCursorMaxAggregateOutputType | null
  }

  type GetIndexerCursorGroupByPayload<T extends IndexerCursorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IndexerCursorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IndexerCursorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IndexerCursorGroupByOutputType[P]>
            : GetScalarType<T[P], IndexerCursorGroupByOutputType[P]>
        }
      >
    >


  export type IndexerCursorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastLedgerSeq?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["indexerCursor"]>

  export type IndexerCursorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastLedgerSeq?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["indexerCursor"]>

  export type IndexerCursorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lastLedgerSeq?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["indexerCursor"]>

  export type IndexerCursorSelectScalar = {
    id?: boolean
    lastLedgerSeq?: boolean
    updatedAt?: boolean
  }

  export type IndexerCursorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lastLedgerSeq" | "updatedAt", ExtArgs["result"]["indexerCursor"]>

  export type $IndexerCursorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IndexerCursor"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      lastLedgerSeq: number
      updatedAt: Date
    }, ExtArgs["result"]["indexerCursor"]>
    composites: {}
  }

  type IndexerCursorGetPayload<S extends boolean | null | undefined | IndexerCursorDefaultArgs> = $Result.GetResult<Prisma.$IndexerCursorPayload, S>

  type IndexerCursorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IndexerCursorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IndexerCursorCountAggregateInputType | true
    }

  export interface IndexerCursorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IndexerCursor'], meta: { name: 'IndexerCursor' } }
    /**
     * Find zero or one IndexerCursor that matches the filter.
     * @param {IndexerCursorFindUniqueArgs} args - Arguments to find a IndexerCursor
     * @example
     * // Get one IndexerCursor
     * const indexerCursor = await prisma.indexerCursor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IndexerCursorFindUniqueArgs>(args: SelectSubset<T, IndexerCursorFindUniqueArgs<ExtArgs>>): Prisma__IndexerCursorClient<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IndexerCursor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IndexerCursorFindUniqueOrThrowArgs} args - Arguments to find a IndexerCursor
     * @example
     * // Get one IndexerCursor
     * const indexerCursor = await prisma.indexerCursor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IndexerCursorFindUniqueOrThrowArgs>(args: SelectSubset<T, IndexerCursorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IndexerCursorClient<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IndexerCursor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerCursorFindFirstArgs} args - Arguments to find a IndexerCursor
     * @example
     * // Get one IndexerCursor
     * const indexerCursor = await prisma.indexerCursor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IndexerCursorFindFirstArgs>(args?: SelectSubset<T, IndexerCursorFindFirstArgs<ExtArgs>>): Prisma__IndexerCursorClient<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IndexerCursor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerCursorFindFirstOrThrowArgs} args - Arguments to find a IndexerCursor
     * @example
     * // Get one IndexerCursor
     * const indexerCursor = await prisma.indexerCursor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IndexerCursorFindFirstOrThrowArgs>(args?: SelectSubset<T, IndexerCursorFindFirstOrThrowArgs<ExtArgs>>): Prisma__IndexerCursorClient<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IndexerCursors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerCursorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IndexerCursors
     * const indexerCursors = await prisma.indexerCursor.findMany()
     * 
     * // Get first 10 IndexerCursors
     * const indexerCursors = await prisma.indexerCursor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const indexerCursorWithIdOnly = await prisma.indexerCursor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IndexerCursorFindManyArgs>(args?: SelectSubset<T, IndexerCursorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IndexerCursor.
     * @param {IndexerCursorCreateArgs} args - Arguments to create a IndexerCursor.
     * @example
     * // Create one IndexerCursor
     * const IndexerCursor = await prisma.indexerCursor.create({
     *   data: {
     *     // ... data to create a IndexerCursor
     *   }
     * })
     * 
     */
    create<T extends IndexerCursorCreateArgs>(args: SelectSubset<T, IndexerCursorCreateArgs<ExtArgs>>): Prisma__IndexerCursorClient<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IndexerCursors.
     * @param {IndexerCursorCreateManyArgs} args - Arguments to create many IndexerCursors.
     * @example
     * // Create many IndexerCursors
     * const indexerCursor = await prisma.indexerCursor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IndexerCursorCreateManyArgs>(args?: SelectSubset<T, IndexerCursorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IndexerCursors and returns the data saved in the database.
     * @param {IndexerCursorCreateManyAndReturnArgs} args - Arguments to create many IndexerCursors.
     * @example
     * // Create many IndexerCursors
     * const indexerCursor = await prisma.indexerCursor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IndexerCursors and only return the `id`
     * const indexerCursorWithIdOnly = await prisma.indexerCursor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IndexerCursorCreateManyAndReturnArgs>(args?: SelectSubset<T, IndexerCursorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IndexerCursor.
     * @param {IndexerCursorDeleteArgs} args - Arguments to delete one IndexerCursor.
     * @example
     * // Delete one IndexerCursor
     * const IndexerCursor = await prisma.indexerCursor.delete({
     *   where: {
     *     // ... filter to delete one IndexerCursor
     *   }
     * })
     * 
     */
    delete<T extends IndexerCursorDeleteArgs>(args: SelectSubset<T, IndexerCursorDeleteArgs<ExtArgs>>): Prisma__IndexerCursorClient<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IndexerCursor.
     * @param {IndexerCursorUpdateArgs} args - Arguments to update one IndexerCursor.
     * @example
     * // Update one IndexerCursor
     * const indexerCursor = await prisma.indexerCursor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IndexerCursorUpdateArgs>(args: SelectSubset<T, IndexerCursorUpdateArgs<ExtArgs>>): Prisma__IndexerCursorClient<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IndexerCursors.
     * @param {IndexerCursorDeleteManyArgs} args - Arguments to filter IndexerCursors to delete.
     * @example
     * // Delete a few IndexerCursors
     * const { count } = await prisma.indexerCursor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IndexerCursorDeleteManyArgs>(args?: SelectSubset<T, IndexerCursorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IndexerCursors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerCursorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IndexerCursors
     * const indexerCursor = await prisma.indexerCursor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IndexerCursorUpdateManyArgs>(args: SelectSubset<T, IndexerCursorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IndexerCursors and returns the data updated in the database.
     * @param {IndexerCursorUpdateManyAndReturnArgs} args - Arguments to update many IndexerCursors.
     * @example
     * // Update many IndexerCursors
     * const indexerCursor = await prisma.indexerCursor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IndexerCursors and only return the `id`
     * const indexerCursorWithIdOnly = await prisma.indexerCursor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IndexerCursorUpdateManyAndReturnArgs>(args: SelectSubset<T, IndexerCursorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IndexerCursor.
     * @param {IndexerCursorUpsertArgs} args - Arguments to update or create a IndexerCursor.
     * @example
     * // Update or create a IndexerCursor
     * const indexerCursor = await prisma.indexerCursor.upsert({
     *   create: {
     *     // ... data to create a IndexerCursor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IndexerCursor we want to update
     *   }
     * })
     */
    upsert<T extends IndexerCursorUpsertArgs>(args: SelectSubset<T, IndexerCursorUpsertArgs<ExtArgs>>): Prisma__IndexerCursorClient<$Result.GetResult<Prisma.$IndexerCursorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IndexerCursors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerCursorCountArgs} args - Arguments to filter IndexerCursors to count.
     * @example
     * // Count the number of IndexerCursors
     * const count = await prisma.indexerCursor.count({
     *   where: {
     *     // ... the filter for the IndexerCursors we want to count
     *   }
     * })
    **/
    count<T extends IndexerCursorCountArgs>(
      args?: Subset<T, IndexerCursorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IndexerCursorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IndexerCursor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerCursorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IndexerCursorAggregateArgs>(args: Subset<T, IndexerCursorAggregateArgs>): Prisma.PrismaPromise<GetIndexerCursorAggregateType<T>>

    /**
     * Group by IndexerCursor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexerCursorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IndexerCursorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IndexerCursorGroupByArgs['orderBy'] }
        : { orderBy?: IndexerCursorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IndexerCursorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIndexerCursorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IndexerCursor model
   */
  readonly fields: IndexerCursorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IndexerCursor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IndexerCursorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IndexerCursor model
   */
  interface IndexerCursorFieldRefs {
    readonly id: FieldRef<"IndexerCursor", 'String'>
    readonly lastLedgerSeq: FieldRef<"IndexerCursor", 'Int'>
    readonly updatedAt: FieldRef<"IndexerCursor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IndexerCursor findUnique
   */
  export type IndexerCursorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * Filter, which IndexerCursor to fetch.
     */
    where: IndexerCursorWhereUniqueInput
  }

  /**
   * IndexerCursor findUniqueOrThrow
   */
  export type IndexerCursorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * Filter, which IndexerCursor to fetch.
     */
    where: IndexerCursorWhereUniqueInput
  }

  /**
   * IndexerCursor findFirst
   */
  export type IndexerCursorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * Filter, which IndexerCursor to fetch.
     */
    where?: IndexerCursorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexerCursors to fetch.
     */
    orderBy?: IndexerCursorOrderByWithRelationInput | IndexerCursorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IndexerCursors.
     */
    cursor?: IndexerCursorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexerCursors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexerCursors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IndexerCursors.
     */
    distinct?: IndexerCursorScalarFieldEnum | IndexerCursorScalarFieldEnum[]
  }

  /**
   * IndexerCursor findFirstOrThrow
   */
  export type IndexerCursorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * Filter, which IndexerCursor to fetch.
     */
    where?: IndexerCursorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexerCursors to fetch.
     */
    orderBy?: IndexerCursorOrderByWithRelationInput | IndexerCursorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IndexerCursors.
     */
    cursor?: IndexerCursorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexerCursors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexerCursors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IndexerCursors.
     */
    distinct?: IndexerCursorScalarFieldEnum | IndexerCursorScalarFieldEnum[]
  }

  /**
   * IndexerCursor findMany
   */
  export type IndexerCursorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * Filter, which IndexerCursors to fetch.
     */
    where?: IndexerCursorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexerCursors to fetch.
     */
    orderBy?: IndexerCursorOrderByWithRelationInput | IndexerCursorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IndexerCursors.
     */
    cursor?: IndexerCursorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexerCursors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexerCursors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IndexerCursors.
     */
    distinct?: IndexerCursorScalarFieldEnum | IndexerCursorScalarFieldEnum[]
  }

  /**
   * IndexerCursor create
   */
  export type IndexerCursorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * The data needed to create a IndexerCursor.
     */
    data: XOR<IndexerCursorCreateInput, IndexerCursorUncheckedCreateInput>
  }

  /**
   * IndexerCursor createMany
   */
  export type IndexerCursorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IndexerCursors.
     */
    data: IndexerCursorCreateManyInput | IndexerCursorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IndexerCursor createManyAndReturn
   */
  export type IndexerCursorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * The data used to create many IndexerCursors.
     */
    data: IndexerCursorCreateManyInput | IndexerCursorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IndexerCursor update
   */
  export type IndexerCursorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * The data needed to update a IndexerCursor.
     */
    data: XOR<IndexerCursorUpdateInput, IndexerCursorUncheckedUpdateInput>
    /**
     * Choose, which IndexerCursor to update.
     */
    where: IndexerCursorWhereUniqueInput
  }

  /**
   * IndexerCursor updateMany
   */
  export type IndexerCursorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IndexerCursors.
     */
    data: XOR<IndexerCursorUpdateManyMutationInput, IndexerCursorUncheckedUpdateManyInput>
    /**
     * Filter which IndexerCursors to update
     */
    where?: IndexerCursorWhereInput
    /**
     * Limit how many IndexerCursors to update.
     */
    limit?: number
  }

  /**
   * IndexerCursor updateManyAndReturn
   */
  export type IndexerCursorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * The data used to update IndexerCursors.
     */
    data: XOR<IndexerCursorUpdateManyMutationInput, IndexerCursorUncheckedUpdateManyInput>
    /**
     * Filter which IndexerCursors to update
     */
    where?: IndexerCursorWhereInput
    /**
     * Limit how many IndexerCursors to update.
     */
    limit?: number
  }

  /**
   * IndexerCursor upsert
   */
  export type IndexerCursorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * The filter to search for the IndexerCursor to update in case it exists.
     */
    where: IndexerCursorWhereUniqueInput
    /**
     * In case the IndexerCursor found by the `where` argument doesn't exist, create a new IndexerCursor with this data.
     */
    create: XOR<IndexerCursorCreateInput, IndexerCursorUncheckedCreateInput>
    /**
     * In case the IndexerCursor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IndexerCursorUpdateInput, IndexerCursorUncheckedUpdateInput>
  }

  /**
   * IndexerCursor delete
   */
  export type IndexerCursorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
    /**
     * Filter which IndexerCursor to delete.
     */
    where: IndexerCursorWhereUniqueInput
  }

  /**
   * IndexerCursor deleteMany
   */
  export type IndexerCursorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IndexerCursors to delete
     */
    where?: IndexerCursorWhereInput
    /**
     * Limit how many IndexerCursors to delete.
     */
    limit?: number
  }

  /**
   * IndexerCursor without action
   */
  export type IndexerCursorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexerCursor
     */
    select?: IndexerCursorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexerCursor
     */
    omit?: IndexerCursorOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ContractEventScalarFieldEnum: {
    id: 'id',
    contractId: 'contractId',
    contractType: 'contractType',
    eventName: 'eventName',
    ledgerSeq: 'ledgerSeq',
    ledgerCloseAt: 'ledgerCloseAt',
    txHash: 'txHash',
    topicXdr: 'topicXdr',
    dataXdr: 'dataXdr',
    processed: 'processed',
    createdAt: 'createdAt'
  };

  export type ContractEventScalarFieldEnum = (typeof ContractEventScalarFieldEnum)[keyof typeof ContractEventScalarFieldEnum]


  export const CampaignScalarFieldEnum: {
    id: 'id',
    campaignId: 'campaignId',
    startupAddress: 'startupAddress',
    investorAddress: 'investorAddress',
    amount: 'amount',
    asset: 'asset',
    state: 'state',
    createdAt: 'createdAt',
    approvedAt: 'approvedAt',
    disputeDeadline: 'disputeDeadline',
    updatedAt: 'updatedAt'
  };

  export type CampaignScalarFieldEnum = (typeof CampaignScalarFieldEnum)[keyof typeof CampaignScalarFieldEnum]


  export const JuryCaseScalarFieldEnum: {
    id: 'id',
    caseId: 'caseId',
    status: 'status',
    forVotes: 'forVotes',
    againstVotes: 'againstVotes',
    totalVotes: 'totalVotes',
    resolvedAt: 'resolvedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type JuryCaseScalarFieldEnum = (typeof JuryCaseScalarFieldEnum)[keyof typeof JuryCaseScalarFieldEnum]


  export const CaseJurorScalarFieldEnum: {
    id: 'id',
    caseId: 'caseId',
    jurorAddr: 'jurorAddr',
    assignedAt: 'assignedAt'
  };

  export type CaseJurorScalarFieldEnum = (typeof CaseJurorScalarFieldEnum)[keyof typeof CaseJurorScalarFieldEnum]


  export const CaseVoteScalarFieldEnum: {
    id: 'id',
    caseId: 'caseId',
    jurorAddr: 'jurorAddr',
    vote: 'vote',
    timestamp: 'timestamp'
  };

  export type CaseVoteScalarFieldEnum = (typeof CaseVoteScalarFieldEnum)[keyof typeof CaseVoteScalarFieldEnum]


  export const JurorScalarFieldEnum: {
    id: 'id',
    address: 'address',
    xlmStake: 'xlmStake',
    platformStake: 'platformStake',
    registeredAt: 'registeredAt',
    isActive: 'isActive'
  };

  export type JurorScalarFieldEnum = (typeof JurorScalarFieldEnum)[keyof typeof JurorScalarFieldEnum]


  export const IdentityScalarFieldEnum: {
    id: 'id',
    identityId: 'identityId',
    commitmentHash: 'commitmentHash',
    isCommitted: 'isCommitted',
    isRevealed: 'isRevealed',
    linkedCaseId: 'linkedCaseId',
    backendRef: 'backendRef',
    revealedAt: 'revealedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type IdentityScalarFieldEnum = (typeof IdentityScalarFieldEnum)[keyof typeof IdentityScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    wallet: 'wallet',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    wallet: 'wallet',
    type: 'type',
    title: 'title',
    body: 'body',
    read: 'read',
    data: 'data',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const IndexerCursorScalarFieldEnum: {
    id: 'id',
    lastLedgerSeq: 'lastLedgerSeq',
    updatedAt: 'updatedAt'
  };

  export type IndexerCursorScalarFieldEnum = (typeof IndexerCursorScalarFieldEnum)[keyof typeof IndexerCursorScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ContractEventWhereInput = {
    AND?: ContractEventWhereInput | ContractEventWhereInput[]
    OR?: ContractEventWhereInput[]
    NOT?: ContractEventWhereInput | ContractEventWhereInput[]
    id?: StringFilter<"ContractEvent"> | string
    contractId?: StringFilter<"ContractEvent"> | string
    contractType?: StringFilter<"ContractEvent"> | string
    eventName?: StringFilter<"ContractEvent"> | string
    ledgerSeq?: IntFilter<"ContractEvent"> | number
    ledgerCloseAt?: DateTimeFilter<"ContractEvent"> | Date | string
    txHash?: StringFilter<"ContractEvent"> | string
    topicXdr?: StringFilter<"ContractEvent"> | string
    dataXdr?: StringFilter<"ContractEvent"> | string
    processed?: BoolFilter<"ContractEvent"> | boolean
    createdAt?: DateTimeFilter<"ContractEvent"> | Date | string
  }

  export type ContractEventOrderByWithRelationInput = {
    id?: SortOrder
    contractId?: SortOrder
    contractType?: SortOrder
    eventName?: SortOrder
    ledgerSeq?: SortOrder
    ledgerCloseAt?: SortOrder
    txHash?: SortOrder
    topicXdr?: SortOrder
    dataXdr?: SortOrder
    processed?: SortOrder
    createdAt?: SortOrder
  }

  export type ContractEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    txHash_eventName?: ContractEventTxHashEventNameCompoundUniqueInput
    AND?: ContractEventWhereInput | ContractEventWhereInput[]
    OR?: ContractEventWhereInput[]
    NOT?: ContractEventWhereInput | ContractEventWhereInput[]
    contractId?: StringFilter<"ContractEvent"> | string
    contractType?: StringFilter<"ContractEvent"> | string
    eventName?: StringFilter<"ContractEvent"> | string
    ledgerSeq?: IntFilter<"ContractEvent"> | number
    ledgerCloseAt?: DateTimeFilter<"ContractEvent"> | Date | string
    txHash?: StringFilter<"ContractEvent"> | string
    topicXdr?: StringFilter<"ContractEvent"> | string
    dataXdr?: StringFilter<"ContractEvent"> | string
    processed?: BoolFilter<"ContractEvent"> | boolean
    createdAt?: DateTimeFilter<"ContractEvent"> | Date | string
  }, "id" | "txHash_eventName">

  export type ContractEventOrderByWithAggregationInput = {
    id?: SortOrder
    contractId?: SortOrder
    contractType?: SortOrder
    eventName?: SortOrder
    ledgerSeq?: SortOrder
    ledgerCloseAt?: SortOrder
    txHash?: SortOrder
    topicXdr?: SortOrder
    dataXdr?: SortOrder
    processed?: SortOrder
    createdAt?: SortOrder
    _count?: ContractEventCountOrderByAggregateInput
    _avg?: ContractEventAvgOrderByAggregateInput
    _max?: ContractEventMaxOrderByAggregateInput
    _min?: ContractEventMinOrderByAggregateInput
    _sum?: ContractEventSumOrderByAggregateInput
  }

  export type ContractEventScalarWhereWithAggregatesInput = {
    AND?: ContractEventScalarWhereWithAggregatesInput | ContractEventScalarWhereWithAggregatesInput[]
    OR?: ContractEventScalarWhereWithAggregatesInput[]
    NOT?: ContractEventScalarWhereWithAggregatesInput | ContractEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContractEvent"> | string
    contractId?: StringWithAggregatesFilter<"ContractEvent"> | string
    contractType?: StringWithAggregatesFilter<"ContractEvent"> | string
    eventName?: StringWithAggregatesFilter<"ContractEvent"> | string
    ledgerSeq?: IntWithAggregatesFilter<"ContractEvent"> | number
    ledgerCloseAt?: DateTimeWithAggregatesFilter<"ContractEvent"> | Date | string
    txHash?: StringWithAggregatesFilter<"ContractEvent"> | string
    topicXdr?: StringWithAggregatesFilter<"ContractEvent"> | string
    dataXdr?: StringWithAggregatesFilter<"ContractEvent"> | string
    processed?: BoolWithAggregatesFilter<"ContractEvent"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ContractEvent"> | Date | string
  }

  export type CampaignWhereInput = {
    AND?: CampaignWhereInput | CampaignWhereInput[]
    OR?: CampaignWhereInput[]
    NOT?: CampaignWhereInput | CampaignWhereInput[]
    id?: IntFilter<"Campaign"> | number
    campaignId?: IntFilter<"Campaign"> | number
    startupAddress?: StringFilter<"Campaign"> | string
    investorAddress?: StringFilter<"Campaign"> | string
    amount?: BigIntFilter<"Campaign"> | bigint | number
    asset?: StringFilter<"Campaign"> | string
    state?: StringFilter<"Campaign"> | string
    createdAt?: DateTimeFilter<"Campaign"> | Date | string
    approvedAt?: DateTimeNullableFilter<"Campaign"> | Date | string | null
    disputeDeadline?: DateTimeNullableFilter<"Campaign"> | Date | string | null
    updatedAt?: DateTimeFilter<"Campaign"> | Date | string
  }

  export type CampaignOrderByWithRelationInput = {
    id?: SortOrder
    campaignId?: SortOrder
    startupAddress?: SortOrder
    investorAddress?: SortOrder
    amount?: SortOrder
    asset?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    approvedAt?: SortOrderInput | SortOrder
    disputeDeadline?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type CampaignWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    campaignId?: number
    AND?: CampaignWhereInput | CampaignWhereInput[]
    OR?: CampaignWhereInput[]
    NOT?: CampaignWhereInput | CampaignWhereInput[]
    startupAddress?: StringFilter<"Campaign"> | string
    investorAddress?: StringFilter<"Campaign"> | string
    amount?: BigIntFilter<"Campaign"> | bigint | number
    asset?: StringFilter<"Campaign"> | string
    state?: StringFilter<"Campaign"> | string
    createdAt?: DateTimeFilter<"Campaign"> | Date | string
    approvedAt?: DateTimeNullableFilter<"Campaign"> | Date | string | null
    disputeDeadline?: DateTimeNullableFilter<"Campaign"> | Date | string | null
    updatedAt?: DateTimeFilter<"Campaign"> | Date | string
  }, "id" | "campaignId">

  export type CampaignOrderByWithAggregationInput = {
    id?: SortOrder
    campaignId?: SortOrder
    startupAddress?: SortOrder
    investorAddress?: SortOrder
    amount?: SortOrder
    asset?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    approvedAt?: SortOrderInput | SortOrder
    disputeDeadline?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: CampaignCountOrderByAggregateInput
    _avg?: CampaignAvgOrderByAggregateInput
    _max?: CampaignMaxOrderByAggregateInput
    _min?: CampaignMinOrderByAggregateInput
    _sum?: CampaignSumOrderByAggregateInput
  }

  export type CampaignScalarWhereWithAggregatesInput = {
    AND?: CampaignScalarWhereWithAggregatesInput | CampaignScalarWhereWithAggregatesInput[]
    OR?: CampaignScalarWhereWithAggregatesInput[]
    NOT?: CampaignScalarWhereWithAggregatesInput | CampaignScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Campaign"> | number
    campaignId?: IntWithAggregatesFilter<"Campaign"> | number
    startupAddress?: StringWithAggregatesFilter<"Campaign"> | string
    investorAddress?: StringWithAggregatesFilter<"Campaign"> | string
    amount?: BigIntWithAggregatesFilter<"Campaign"> | bigint | number
    asset?: StringWithAggregatesFilter<"Campaign"> | string
    state?: StringWithAggregatesFilter<"Campaign"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Campaign"> | Date | string
    approvedAt?: DateTimeNullableWithAggregatesFilter<"Campaign"> | Date | string | null
    disputeDeadline?: DateTimeNullableWithAggregatesFilter<"Campaign"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"Campaign"> | Date | string
  }

  export type JuryCaseWhereInput = {
    AND?: JuryCaseWhereInput | JuryCaseWhereInput[]
    OR?: JuryCaseWhereInput[]
    NOT?: JuryCaseWhereInput | JuryCaseWhereInput[]
    id?: IntFilter<"JuryCase"> | number
    caseId?: IntFilter<"JuryCase"> | number
    status?: StringFilter<"JuryCase"> | string
    forVotes?: IntFilter<"JuryCase"> | number
    againstVotes?: IntFilter<"JuryCase"> | number
    totalVotes?: IntFilter<"JuryCase"> | number
    resolvedAt?: DateTimeNullableFilter<"JuryCase"> | Date | string | null
    createdAt?: DateTimeFilter<"JuryCase"> | Date | string
    updatedAt?: DateTimeFilter<"JuryCase"> | Date | string
    jurors?: CaseJurorListRelationFilter
    votes?: CaseVoteListRelationFilter
  }

  export type JuryCaseOrderByWithRelationInput = {
    id?: SortOrder
    caseId?: SortOrder
    status?: SortOrder
    forVotes?: SortOrder
    againstVotes?: SortOrder
    totalVotes?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    jurors?: CaseJurorOrderByRelationAggregateInput
    votes?: CaseVoteOrderByRelationAggregateInput
  }

  export type JuryCaseWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    caseId?: number
    AND?: JuryCaseWhereInput | JuryCaseWhereInput[]
    OR?: JuryCaseWhereInput[]
    NOT?: JuryCaseWhereInput | JuryCaseWhereInput[]
    status?: StringFilter<"JuryCase"> | string
    forVotes?: IntFilter<"JuryCase"> | number
    againstVotes?: IntFilter<"JuryCase"> | number
    totalVotes?: IntFilter<"JuryCase"> | number
    resolvedAt?: DateTimeNullableFilter<"JuryCase"> | Date | string | null
    createdAt?: DateTimeFilter<"JuryCase"> | Date | string
    updatedAt?: DateTimeFilter<"JuryCase"> | Date | string
    jurors?: CaseJurorListRelationFilter
    votes?: CaseVoteListRelationFilter
  }, "id" | "caseId">

  export type JuryCaseOrderByWithAggregationInput = {
    id?: SortOrder
    caseId?: SortOrder
    status?: SortOrder
    forVotes?: SortOrder
    againstVotes?: SortOrder
    totalVotes?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: JuryCaseCountOrderByAggregateInput
    _avg?: JuryCaseAvgOrderByAggregateInput
    _max?: JuryCaseMaxOrderByAggregateInput
    _min?: JuryCaseMinOrderByAggregateInput
    _sum?: JuryCaseSumOrderByAggregateInput
  }

  export type JuryCaseScalarWhereWithAggregatesInput = {
    AND?: JuryCaseScalarWhereWithAggregatesInput | JuryCaseScalarWhereWithAggregatesInput[]
    OR?: JuryCaseScalarWhereWithAggregatesInput[]
    NOT?: JuryCaseScalarWhereWithAggregatesInput | JuryCaseScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"JuryCase"> | number
    caseId?: IntWithAggregatesFilter<"JuryCase"> | number
    status?: StringWithAggregatesFilter<"JuryCase"> | string
    forVotes?: IntWithAggregatesFilter<"JuryCase"> | number
    againstVotes?: IntWithAggregatesFilter<"JuryCase"> | number
    totalVotes?: IntWithAggregatesFilter<"JuryCase"> | number
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"JuryCase"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"JuryCase"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"JuryCase"> | Date | string
  }

  export type CaseJurorWhereInput = {
    AND?: CaseJurorWhereInput | CaseJurorWhereInput[]
    OR?: CaseJurorWhereInput[]
    NOT?: CaseJurorWhereInput | CaseJurorWhereInput[]
    id?: IntFilter<"CaseJuror"> | number
    caseId?: IntFilter<"CaseJuror"> | number
    jurorAddr?: StringFilter<"CaseJuror"> | string
    assignedAt?: DateTimeFilter<"CaseJuror"> | Date | string
    case?: XOR<JuryCaseScalarRelationFilter, JuryCaseWhereInput>
  }

  export type CaseJurorOrderByWithRelationInput = {
    id?: SortOrder
    caseId?: SortOrder
    jurorAddr?: SortOrder
    assignedAt?: SortOrder
    case?: JuryCaseOrderByWithRelationInput
  }

  export type CaseJurorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    caseId_jurorAddr?: CaseJurorCaseIdJurorAddrCompoundUniqueInput
    AND?: CaseJurorWhereInput | CaseJurorWhereInput[]
    OR?: CaseJurorWhereInput[]
    NOT?: CaseJurorWhereInput | CaseJurorWhereInput[]
    caseId?: IntFilter<"CaseJuror"> | number
    jurorAddr?: StringFilter<"CaseJuror"> | string
    assignedAt?: DateTimeFilter<"CaseJuror"> | Date | string
    case?: XOR<JuryCaseScalarRelationFilter, JuryCaseWhereInput>
  }, "id" | "caseId_jurorAddr">

  export type CaseJurorOrderByWithAggregationInput = {
    id?: SortOrder
    caseId?: SortOrder
    jurorAddr?: SortOrder
    assignedAt?: SortOrder
    _count?: CaseJurorCountOrderByAggregateInput
    _avg?: CaseJurorAvgOrderByAggregateInput
    _max?: CaseJurorMaxOrderByAggregateInput
    _min?: CaseJurorMinOrderByAggregateInput
    _sum?: CaseJurorSumOrderByAggregateInput
  }

  export type CaseJurorScalarWhereWithAggregatesInput = {
    AND?: CaseJurorScalarWhereWithAggregatesInput | CaseJurorScalarWhereWithAggregatesInput[]
    OR?: CaseJurorScalarWhereWithAggregatesInput[]
    NOT?: CaseJurorScalarWhereWithAggregatesInput | CaseJurorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CaseJuror"> | number
    caseId?: IntWithAggregatesFilter<"CaseJuror"> | number
    jurorAddr?: StringWithAggregatesFilter<"CaseJuror"> | string
    assignedAt?: DateTimeWithAggregatesFilter<"CaseJuror"> | Date | string
  }

  export type CaseVoteWhereInput = {
    AND?: CaseVoteWhereInput | CaseVoteWhereInput[]
    OR?: CaseVoteWhereInput[]
    NOT?: CaseVoteWhereInput | CaseVoteWhereInput[]
    id?: IntFilter<"CaseVote"> | number
    caseId?: IntFilter<"CaseVote"> | number
    jurorAddr?: StringFilter<"CaseVote"> | string
    vote?: StringFilter<"CaseVote"> | string
    timestamp?: DateTimeFilter<"CaseVote"> | Date | string
    case?: XOR<JuryCaseScalarRelationFilter, JuryCaseWhereInput>
  }

  export type CaseVoteOrderByWithRelationInput = {
    id?: SortOrder
    caseId?: SortOrder
    jurorAddr?: SortOrder
    vote?: SortOrder
    timestamp?: SortOrder
    case?: JuryCaseOrderByWithRelationInput
  }

  export type CaseVoteWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    caseId_jurorAddr?: CaseVoteCaseIdJurorAddrCompoundUniqueInput
    AND?: CaseVoteWhereInput | CaseVoteWhereInput[]
    OR?: CaseVoteWhereInput[]
    NOT?: CaseVoteWhereInput | CaseVoteWhereInput[]
    caseId?: IntFilter<"CaseVote"> | number
    jurorAddr?: StringFilter<"CaseVote"> | string
    vote?: StringFilter<"CaseVote"> | string
    timestamp?: DateTimeFilter<"CaseVote"> | Date | string
    case?: XOR<JuryCaseScalarRelationFilter, JuryCaseWhereInput>
  }, "id" | "caseId_jurorAddr">

  export type CaseVoteOrderByWithAggregationInput = {
    id?: SortOrder
    caseId?: SortOrder
    jurorAddr?: SortOrder
    vote?: SortOrder
    timestamp?: SortOrder
    _count?: CaseVoteCountOrderByAggregateInput
    _avg?: CaseVoteAvgOrderByAggregateInput
    _max?: CaseVoteMaxOrderByAggregateInput
    _min?: CaseVoteMinOrderByAggregateInput
    _sum?: CaseVoteSumOrderByAggregateInput
  }

  export type CaseVoteScalarWhereWithAggregatesInput = {
    AND?: CaseVoteScalarWhereWithAggregatesInput | CaseVoteScalarWhereWithAggregatesInput[]
    OR?: CaseVoteScalarWhereWithAggregatesInput[]
    NOT?: CaseVoteScalarWhereWithAggregatesInput | CaseVoteScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CaseVote"> | number
    caseId?: IntWithAggregatesFilter<"CaseVote"> | number
    jurorAddr?: StringWithAggregatesFilter<"CaseVote"> | string
    vote?: StringWithAggregatesFilter<"CaseVote"> | string
    timestamp?: DateTimeWithAggregatesFilter<"CaseVote"> | Date | string
  }

  export type JurorWhereInput = {
    AND?: JurorWhereInput | JurorWhereInput[]
    OR?: JurorWhereInput[]
    NOT?: JurorWhereInput | JurorWhereInput[]
    id?: IntFilter<"Juror"> | number
    address?: StringFilter<"Juror"> | string
    xlmStake?: BigIntFilter<"Juror"> | bigint | number
    platformStake?: BigIntFilter<"Juror"> | bigint | number
    registeredAt?: DateTimeFilter<"Juror"> | Date | string
    isActive?: BoolFilter<"Juror"> | boolean
  }

  export type JurorOrderByWithRelationInput = {
    id?: SortOrder
    address?: SortOrder
    xlmStake?: SortOrder
    platformStake?: SortOrder
    registeredAt?: SortOrder
    isActive?: SortOrder
  }

  export type JurorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    address?: string
    AND?: JurorWhereInput | JurorWhereInput[]
    OR?: JurorWhereInput[]
    NOT?: JurorWhereInput | JurorWhereInput[]
    xlmStake?: BigIntFilter<"Juror"> | bigint | number
    platformStake?: BigIntFilter<"Juror"> | bigint | number
    registeredAt?: DateTimeFilter<"Juror"> | Date | string
    isActive?: BoolFilter<"Juror"> | boolean
  }, "id" | "address">

  export type JurorOrderByWithAggregationInput = {
    id?: SortOrder
    address?: SortOrder
    xlmStake?: SortOrder
    platformStake?: SortOrder
    registeredAt?: SortOrder
    isActive?: SortOrder
    _count?: JurorCountOrderByAggregateInput
    _avg?: JurorAvgOrderByAggregateInput
    _max?: JurorMaxOrderByAggregateInput
    _min?: JurorMinOrderByAggregateInput
    _sum?: JurorSumOrderByAggregateInput
  }

  export type JurorScalarWhereWithAggregatesInput = {
    AND?: JurorScalarWhereWithAggregatesInput | JurorScalarWhereWithAggregatesInput[]
    OR?: JurorScalarWhereWithAggregatesInput[]
    NOT?: JurorScalarWhereWithAggregatesInput | JurorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Juror"> | number
    address?: StringWithAggregatesFilter<"Juror"> | string
    xlmStake?: BigIntWithAggregatesFilter<"Juror"> | bigint | number
    platformStake?: BigIntWithAggregatesFilter<"Juror"> | bigint | number
    registeredAt?: DateTimeWithAggregatesFilter<"Juror"> | Date | string
    isActive?: BoolWithAggregatesFilter<"Juror"> | boolean
  }

  export type IdentityWhereInput = {
    AND?: IdentityWhereInput | IdentityWhereInput[]
    OR?: IdentityWhereInput[]
    NOT?: IdentityWhereInput | IdentityWhereInput[]
    id?: IntFilter<"Identity"> | number
    identityId?: StringFilter<"Identity"> | string
    commitmentHash?: StringNullableFilter<"Identity"> | string | null
    isCommitted?: BoolFilter<"Identity"> | boolean
    isRevealed?: BoolFilter<"Identity"> | boolean
    linkedCaseId?: IntNullableFilter<"Identity"> | number | null
    backendRef?: StringNullableFilter<"Identity"> | string | null
    revealedAt?: DateTimeNullableFilter<"Identity"> | Date | string | null
    createdAt?: DateTimeFilter<"Identity"> | Date | string
    updatedAt?: DateTimeFilter<"Identity"> | Date | string
  }

  export type IdentityOrderByWithRelationInput = {
    id?: SortOrder
    identityId?: SortOrder
    commitmentHash?: SortOrderInput | SortOrder
    isCommitted?: SortOrder
    isRevealed?: SortOrder
    linkedCaseId?: SortOrderInput | SortOrder
    backendRef?: SortOrderInput | SortOrder
    revealedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IdentityWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    identityId?: string
    AND?: IdentityWhereInput | IdentityWhereInput[]
    OR?: IdentityWhereInput[]
    NOT?: IdentityWhereInput | IdentityWhereInput[]
    commitmentHash?: StringNullableFilter<"Identity"> | string | null
    isCommitted?: BoolFilter<"Identity"> | boolean
    isRevealed?: BoolFilter<"Identity"> | boolean
    linkedCaseId?: IntNullableFilter<"Identity"> | number | null
    backendRef?: StringNullableFilter<"Identity"> | string | null
    revealedAt?: DateTimeNullableFilter<"Identity"> | Date | string | null
    createdAt?: DateTimeFilter<"Identity"> | Date | string
    updatedAt?: DateTimeFilter<"Identity"> | Date | string
  }, "id" | "identityId">

  export type IdentityOrderByWithAggregationInput = {
    id?: SortOrder
    identityId?: SortOrder
    commitmentHash?: SortOrderInput | SortOrder
    isCommitted?: SortOrder
    isRevealed?: SortOrder
    linkedCaseId?: SortOrderInput | SortOrder
    backendRef?: SortOrderInput | SortOrder
    revealedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: IdentityCountOrderByAggregateInput
    _avg?: IdentityAvgOrderByAggregateInput
    _max?: IdentityMaxOrderByAggregateInput
    _min?: IdentityMinOrderByAggregateInput
    _sum?: IdentitySumOrderByAggregateInput
  }

  export type IdentityScalarWhereWithAggregatesInput = {
    AND?: IdentityScalarWhereWithAggregatesInput | IdentityScalarWhereWithAggregatesInput[]
    OR?: IdentityScalarWhereWithAggregatesInput[]
    NOT?: IdentityScalarWhereWithAggregatesInput | IdentityScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Identity"> | number
    identityId?: StringWithAggregatesFilter<"Identity"> | string
    commitmentHash?: StringNullableWithAggregatesFilter<"Identity"> | string | null
    isCommitted?: BoolWithAggregatesFilter<"Identity"> | boolean
    isRevealed?: BoolWithAggregatesFilter<"Identity"> | boolean
    linkedCaseId?: IntNullableWithAggregatesFilter<"Identity"> | number | null
    backendRef?: StringNullableWithAggregatesFilter<"Identity"> | string | null
    revealedAt?: DateTimeNullableWithAggregatesFilter<"Identity"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Identity"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Identity"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    wallet?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    wallet?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    wallet?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
  }, "id">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    wallet?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    wallet?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    wallet?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    data?: JsonNullableFilter<"Notification">
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    wallet?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    read?: SortOrder
    data?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    wallet?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    data?: JsonNullableFilter<"Notification">
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    wallet?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    read?: SortOrder
    data?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    wallet?: StringWithAggregatesFilter<"Notification"> | string
    type?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    body?: StringWithAggregatesFilter<"Notification"> | string
    read?: BoolWithAggregatesFilter<"Notification"> | boolean
    data?: JsonNullableWithAggregatesFilter<"Notification">
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type IndexerCursorWhereInput = {
    AND?: IndexerCursorWhereInput | IndexerCursorWhereInput[]
    OR?: IndexerCursorWhereInput[]
    NOT?: IndexerCursorWhereInput | IndexerCursorWhereInput[]
    id?: StringFilter<"IndexerCursor"> | string
    lastLedgerSeq?: IntFilter<"IndexerCursor"> | number
    updatedAt?: DateTimeFilter<"IndexerCursor"> | Date | string
  }

  export type IndexerCursorOrderByWithRelationInput = {
    id?: SortOrder
    lastLedgerSeq?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexerCursorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IndexerCursorWhereInput | IndexerCursorWhereInput[]
    OR?: IndexerCursorWhereInput[]
    NOT?: IndexerCursorWhereInput | IndexerCursorWhereInput[]
    lastLedgerSeq?: IntFilter<"IndexerCursor"> | number
    updatedAt?: DateTimeFilter<"IndexerCursor"> | Date | string
  }, "id">

  export type IndexerCursorOrderByWithAggregationInput = {
    id?: SortOrder
    lastLedgerSeq?: SortOrder
    updatedAt?: SortOrder
    _count?: IndexerCursorCountOrderByAggregateInput
    _avg?: IndexerCursorAvgOrderByAggregateInput
    _max?: IndexerCursorMaxOrderByAggregateInput
    _min?: IndexerCursorMinOrderByAggregateInput
    _sum?: IndexerCursorSumOrderByAggregateInput
  }

  export type IndexerCursorScalarWhereWithAggregatesInput = {
    AND?: IndexerCursorScalarWhereWithAggregatesInput | IndexerCursorScalarWhereWithAggregatesInput[]
    OR?: IndexerCursorScalarWhereWithAggregatesInput[]
    NOT?: IndexerCursorScalarWhereWithAggregatesInput | IndexerCursorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IndexerCursor"> | string
    lastLedgerSeq?: IntWithAggregatesFilter<"IndexerCursor"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"IndexerCursor"> | Date | string
  }

  export type ContractEventCreateInput = {
    id?: string
    contractId: string
    contractType: string
    eventName: string
    ledgerSeq: number
    ledgerCloseAt: Date | string
    txHash: string
    topicXdr: string
    dataXdr: string
    processed?: boolean
    createdAt?: Date | string
  }

  export type ContractEventUncheckedCreateInput = {
    id?: string
    contractId: string
    contractType: string
    eventName: string
    ledgerSeq: number
    ledgerCloseAt: Date | string
    txHash: string
    topicXdr: string
    dataXdr: string
    processed?: boolean
    createdAt?: Date | string
  }

  export type ContractEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contractId?: StringFieldUpdateOperationsInput | string
    contractType?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    ledgerSeq?: IntFieldUpdateOperationsInput | number
    ledgerCloseAt?: DateTimeFieldUpdateOperationsInput | Date | string
    txHash?: StringFieldUpdateOperationsInput | string
    topicXdr?: StringFieldUpdateOperationsInput | string
    dataXdr?: StringFieldUpdateOperationsInput | string
    processed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContractEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contractId?: StringFieldUpdateOperationsInput | string
    contractType?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    ledgerSeq?: IntFieldUpdateOperationsInput | number
    ledgerCloseAt?: DateTimeFieldUpdateOperationsInput | Date | string
    txHash?: StringFieldUpdateOperationsInput | string
    topicXdr?: StringFieldUpdateOperationsInput | string
    dataXdr?: StringFieldUpdateOperationsInput | string
    processed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContractEventCreateManyInput = {
    id?: string
    contractId: string
    contractType: string
    eventName: string
    ledgerSeq: number
    ledgerCloseAt: Date | string
    txHash: string
    topicXdr: string
    dataXdr: string
    processed?: boolean
    createdAt?: Date | string
  }

  export type ContractEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    contractId?: StringFieldUpdateOperationsInput | string
    contractType?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    ledgerSeq?: IntFieldUpdateOperationsInput | number
    ledgerCloseAt?: DateTimeFieldUpdateOperationsInput | Date | string
    txHash?: StringFieldUpdateOperationsInput | string
    topicXdr?: StringFieldUpdateOperationsInput | string
    dataXdr?: StringFieldUpdateOperationsInput | string
    processed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContractEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    contractId?: StringFieldUpdateOperationsInput | string
    contractType?: StringFieldUpdateOperationsInput | string
    eventName?: StringFieldUpdateOperationsInput | string
    ledgerSeq?: IntFieldUpdateOperationsInput | number
    ledgerCloseAt?: DateTimeFieldUpdateOperationsInput | Date | string
    txHash?: StringFieldUpdateOperationsInput | string
    topicXdr?: StringFieldUpdateOperationsInput | string
    dataXdr?: StringFieldUpdateOperationsInput | string
    processed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignCreateInput = {
    campaignId: number
    startupAddress: string
    investorAddress: string
    amount: bigint | number
    asset: string
    state?: string
    createdAt?: Date | string
    approvedAt?: Date | string | null
    disputeDeadline?: Date | string | null
    updatedAt?: Date | string
  }

  export type CampaignUncheckedCreateInput = {
    id?: number
    campaignId: number
    startupAddress: string
    investorAddress: string
    amount: bigint | number
    asset: string
    state?: string
    createdAt?: Date | string
    approvedAt?: Date | string | null
    disputeDeadline?: Date | string | null
    updatedAt?: Date | string
  }

  export type CampaignUpdateInput = {
    campaignId?: IntFieldUpdateOperationsInput | number
    startupAddress?: StringFieldUpdateOperationsInput | string
    investorAddress?: StringFieldUpdateOperationsInput | string
    amount?: BigIntFieldUpdateOperationsInput | bigint | number
    asset?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disputeDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    campaignId?: IntFieldUpdateOperationsInput | number
    startupAddress?: StringFieldUpdateOperationsInput | string
    investorAddress?: StringFieldUpdateOperationsInput | string
    amount?: BigIntFieldUpdateOperationsInput | bigint | number
    asset?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disputeDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignCreateManyInput = {
    id?: number
    campaignId: number
    startupAddress: string
    investorAddress: string
    amount: bigint | number
    asset: string
    state?: string
    createdAt?: Date | string
    approvedAt?: Date | string | null
    disputeDeadline?: Date | string | null
    updatedAt?: Date | string
  }

  export type CampaignUpdateManyMutationInput = {
    campaignId?: IntFieldUpdateOperationsInput | number
    startupAddress?: StringFieldUpdateOperationsInput | string
    investorAddress?: StringFieldUpdateOperationsInput | string
    amount?: BigIntFieldUpdateOperationsInput | bigint | number
    asset?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disputeDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    campaignId?: IntFieldUpdateOperationsInput | number
    startupAddress?: StringFieldUpdateOperationsInput | string
    investorAddress?: StringFieldUpdateOperationsInput | string
    amount?: BigIntFieldUpdateOperationsInput | bigint | number
    asset?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disputeDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JuryCaseCreateInput = {
    caseId: number
    status?: string
    forVotes?: number
    againstVotes?: number
    totalVotes?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    jurors?: CaseJurorCreateNestedManyWithoutCaseInput
    votes?: CaseVoteCreateNestedManyWithoutCaseInput
  }

  export type JuryCaseUncheckedCreateInput = {
    id?: number
    caseId: number
    status?: string
    forVotes?: number
    againstVotes?: number
    totalVotes?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    jurors?: CaseJurorUncheckedCreateNestedManyWithoutCaseInput
    votes?: CaseVoteUncheckedCreateNestedManyWithoutCaseInput
  }

  export type JuryCaseUpdateInput = {
    caseId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    forVotes?: IntFieldUpdateOperationsInput | number
    againstVotes?: IntFieldUpdateOperationsInput | number
    totalVotes?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jurors?: CaseJurorUpdateManyWithoutCaseNestedInput
    votes?: CaseVoteUpdateManyWithoutCaseNestedInput
  }

  export type JuryCaseUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    caseId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    forVotes?: IntFieldUpdateOperationsInput | number
    againstVotes?: IntFieldUpdateOperationsInput | number
    totalVotes?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jurors?: CaseJurorUncheckedUpdateManyWithoutCaseNestedInput
    votes?: CaseVoteUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type JuryCaseCreateManyInput = {
    id?: number
    caseId: number
    status?: string
    forVotes?: number
    againstVotes?: number
    totalVotes?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JuryCaseUpdateManyMutationInput = {
    caseId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    forVotes?: IntFieldUpdateOperationsInput | number
    againstVotes?: IntFieldUpdateOperationsInput | number
    totalVotes?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JuryCaseUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    caseId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    forVotes?: IntFieldUpdateOperationsInput | number
    againstVotes?: IntFieldUpdateOperationsInput | number
    totalVotes?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseJurorCreateInput = {
    jurorAddr: string
    assignedAt?: Date | string
    case: JuryCaseCreateNestedOneWithoutJurorsInput
  }

  export type CaseJurorUncheckedCreateInput = {
    id?: number
    caseId: number
    jurorAddr: string
    assignedAt?: Date | string
  }

  export type CaseJurorUpdateInput = {
    jurorAddr?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: JuryCaseUpdateOneRequiredWithoutJurorsNestedInput
  }

  export type CaseJurorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    caseId?: IntFieldUpdateOperationsInput | number
    jurorAddr?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseJurorCreateManyInput = {
    id?: number
    caseId: number
    jurorAddr: string
    assignedAt?: Date | string
  }

  export type CaseJurorUpdateManyMutationInput = {
    jurorAddr?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseJurorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    caseId?: IntFieldUpdateOperationsInput | number
    jurorAddr?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseVoteCreateInput = {
    jurorAddr: string
    vote: string
    timestamp?: Date | string
    case: JuryCaseCreateNestedOneWithoutVotesInput
  }

  export type CaseVoteUncheckedCreateInput = {
    id?: number
    caseId: number
    jurorAddr: string
    vote: string
    timestamp?: Date | string
  }

  export type CaseVoteUpdateInput = {
    jurorAddr?: StringFieldUpdateOperationsInput | string
    vote?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    case?: JuryCaseUpdateOneRequiredWithoutVotesNestedInput
  }

  export type CaseVoteUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    caseId?: IntFieldUpdateOperationsInput | number
    jurorAddr?: StringFieldUpdateOperationsInput | string
    vote?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseVoteCreateManyInput = {
    id?: number
    caseId: number
    jurorAddr: string
    vote: string
    timestamp?: Date | string
  }

  export type CaseVoteUpdateManyMutationInput = {
    jurorAddr?: StringFieldUpdateOperationsInput | string
    vote?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseVoteUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    caseId?: IntFieldUpdateOperationsInput | number
    jurorAddr?: StringFieldUpdateOperationsInput | string
    vote?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurorCreateInput = {
    address: string
    xlmStake: bigint | number
    platformStake: bigint | number
    registeredAt?: Date | string
    isActive?: boolean
  }

  export type JurorUncheckedCreateInput = {
    id?: number
    address: string
    xlmStake: bigint | number
    platformStake: bigint | number
    registeredAt?: Date | string
    isActive?: boolean
  }

  export type JurorUpdateInput = {
    address?: StringFieldUpdateOperationsInput | string
    xlmStake?: BigIntFieldUpdateOperationsInput | bigint | number
    platformStake?: BigIntFieldUpdateOperationsInput | bigint | number
    registeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type JurorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    xlmStake?: BigIntFieldUpdateOperationsInput | bigint | number
    platformStake?: BigIntFieldUpdateOperationsInput | bigint | number
    registeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type JurorCreateManyInput = {
    id?: number
    address: string
    xlmStake: bigint | number
    platformStake: bigint | number
    registeredAt?: Date | string
    isActive?: boolean
  }

  export type JurorUpdateManyMutationInput = {
    address?: StringFieldUpdateOperationsInput | string
    xlmStake?: BigIntFieldUpdateOperationsInput | bigint | number
    platformStake?: BigIntFieldUpdateOperationsInput | bigint | number
    registeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type JurorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    xlmStake?: BigIntFieldUpdateOperationsInput | bigint | number
    platformStake?: BigIntFieldUpdateOperationsInput | bigint | number
    registeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type IdentityCreateInput = {
    identityId: string
    commitmentHash?: string | null
    isCommitted?: boolean
    isRevealed?: boolean
    linkedCaseId?: number | null
    backendRef?: string | null
    revealedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IdentityUncheckedCreateInput = {
    id?: number
    identityId: string
    commitmentHash?: string | null
    isCommitted?: boolean
    isRevealed?: boolean
    linkedCaseId?: number | null
    backendRef?: string | null
    revealedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IdentityUpdateInput = {
    identityId?: StringFieldUpdateOperationsInput | string
    commitmentHash?: NullableStringFieldUpdateOperationsInput | string | null
    isCommitted?: BoolFieldUpdateOperationsInput | boolean
    isRevealed?: BoolFieldUpdateOperationsInput | boolean
    linkedCaseId?: NullableIntFieldUpdateOperationsInput | number | null
    backendRef?: NullableStringFieldUpdateOperationsInput | string | null
    revealedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdentityUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    identityId?: StringFieldUpdateOperationsInput | string
    commitmentHash?: NullableStringFieldUpdateOperationsInput | string | null
    isCommitted?: BoolFieldUpdateOperationsInput | boolean
    isRevealed?: BoolFieldUpdateOperationsInput | boolean
    linkedCaseId?: NullableIntFieldUpdateOperationsInput | number | null
    backendRef?: NullableStringFieldUpdateOperationsInput | string | null
    revealedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdentityCreateManyInput = {
    id?: number
    identityId: string
    commitmentHash?: string | null
    isCommitted?: boolean
    isRevealed?: boolean
    linkedCaseId?: number | null
    backendRef?: string | null
    revealedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IdentityUpdateManyMutationInput = {
    identityId?: StringFieldUpdateOperationsInput | string
    commitmentHash?: NullableStringFieldUpdateOperationsInput | string | null
    isCommitted?: BoolFieldUpdateOperationsInput | boolean
    isRevealed?: BoolFieldUpdateOperationsInput | boolean
    linkedCaseId?: NullableIntFieldUpdateOperationsInput | number | null
    backendRef?: NullableStringFieldUpdateOperationsInput | string | null
    revealedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdentityUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    identityId?: StringFieldUpdateOperationsInput | string
    commitmentHash?: NullableStringFieldUpdateOperationsInput | string | null
    isCommitted?: BoolFieldUpdateOperationsInput | boolean
    isRevealed?: BoolFieldUpdateOperationsInput | boolean
    linkedCaseId?: NullableIntFieldUpdateOperationsInput | number | null
    backendRef?: NullableStringFieldUpdateOperationsInput | string | null
    revealedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    wallet: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    wallet: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    wallet: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    wallet: string
    type: string
    title: string
    body: string
    read?: boolean
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    wallet: string
    type: string
    title: string
    body: string
    read?: boolean
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    wallet: string
    type: string
    title: string
    body: string
    read?: boolean
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    wallet?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexerCursorCreateInput = {
    id?: string
    lastLedgerSeq?: number
    updatedAt?: Date | string
  }

  export type IndexerCursorUncheckedCreateInput = {
    id?: string
    lastLedgerSeq?: number
    updatedAt?: Date | string
  }

  export type IndexerCursorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastLedgerSeq?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexerCursorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastLedgerSeq?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexerCursorCreateManyInput = {
    id?: string
    lastLedgerSeq?: number
    updatedAt?: Date | string
  }

  export type IndexerCursorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastLedgerSeq?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexerCursorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    lastLedgerSeq?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ContractEventTxHashEventNameCompoundUniqueInput = {
    txHash: string
    eventName: string
  }

  export type ContractEventCountOrderByAggregateInput = {
    id?: SortOrder
    contractId?: SortOrder
    contractType?: SortOrder
    eventName?: SortOrder
    ledgerSeq?: SortOrder
    ledgerCloseAt?: SortOrder
    txHash?: SortOrder
    topicXdr?: SortOrder
    dataXdr?: SortOrder
    processed?: SortOrder
    createdAt?: SortOrder
  }

  export type ContractEventAvgOrderByAggregateInput = {
    ledgerSeq?: SortOrder
  }

  export type ContractEventMaxOrderByAggregateInput = {
    id?: SortOrder
    contractId?: SortOrder
    contractType?: SortOrder
    eventName?: SortOrder
    ledgerSeq?: SortOrder
    ledgerCloseAt?: SortOrder
    txHash?: SortOrder
    topicXdr?: SortOrder
    dataXdr?: SortOrder
    processed?: SortOrder
    createdAt?: SortOrder
  }

  export type ContractEventMinOrderByAggregateInput = {
    id?: SortOrder
    contractId?: SortOrder
    contractType?: SortOrder
    eventName?: SortOrder
    ledgerSeq?: SortOrder
    ledgerCloseAt?: SortOrder
    txHash?: SortOrder
    topicXdr?: SortOrder
    dataXdr?: SortOrder
    processed?: SortOrder
    createdAt?: SortOrder
  }

  export type ContractEventSumOrderByAggregateInput = {
    ledgerSeq?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CampaignCountOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    startupAddress?: SortOrder
    investorAddress?: SortOrder
    amount?: SortOrder
    asset?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    approvedAt?: SortOrder
    disputeDeadline?: SortOrder
    updatedAt?: SortOrder
  }

  export type CampaignAvgOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    amount?: SortOrder
  }

  export type CampaignMaxOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    startupAddress?: SortOrder
    investorAddress?: SortOrder
    amount?: SortOrder
    asset?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    approvedAt?: SortOrder
    disputeDeadline?: SortOrder
    updatedAt?: SortOrder
  }

  export type CampaignMinOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    startupAddress?: SortOrder
    investorAddress?: SortOrder
    amount?: SortOrder
    asset?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    approvedAt?: SortOrder
    disputeDeadline?: SortOrder
    updatedAt?: SortOrder
  }

  export type CampaignSumOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    amount?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type CaseJurorListRelationFilter = {
    every?: CaseJurorWhereInput
    some?: CaseJurorWhereInput
    none?: CaseJurorWhereInput
  }

  export type CaseVoteListRelationFilter = {
    every?: CaseVoteWhereInput
    some?: CaseVoteWhereInput
    none?: CaseVoteWhereInput
  }

  export type CaseJurorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CaseVoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JuryCaseCountOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    status?: SortOrder
    forVotes?: SortOrder
    againstVotes?: SortOrder
    totalVotes?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JuryCaseAvgOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    forVotes?: SortOrder
    againstVotes?: SortOrder
    totalVotes?: SortOrder
  }

  export type JuryCaseMaxOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    status?: SortOrder
    forVotes?: SortOrder
    againstVotes?: SortOrder
    totalVotes?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JuryCaseMinOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    status?: SortOrder
    forVotes?: SortOrder
    againstVotes?: SortOrder
    totalVotes?: SortOrder
    resolvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JuryCaseSumOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    forVotes?: SortOrder
    againstVotes?: SortOrder
    totalVotes?: SortOrder
  }

  export type JuryCaseScalarRelationFilter = {
    is?: JuryCaseWhereInput
    isNot?: JuryCaseWhereInput
  }

  export type CaseJurorCaseIdJurorAddrCompoundUniqueInput = {
    caseId: number
    jurorAddr: string
  }

  export type CaseJurorCountOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    jurorAddr?: SortOrder
    assignedAt?: SortOrder
  }

  export type CaseJurorAvgOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
  }

  export type CaseJurorMaxOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    jurorAddr?: SortOrder
    assignedAt?: SortOrder
  }

  export type CaseJurorMinOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    jurorAddr?: SortOrder
    assignedAt?: SortOrder
  }

  export type CaseJurorSumOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
  }

  export type CaseVoteCaseIdJurorAddrCompoundUniqueInput = {
    caseId: number
    jurorAddr: string
  }

  export type CaseVoteCountOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    jurorAddr?: SortOrder
    vote?: SortOrder
    timestamp?: SortOrder
  }

  export type CaseVoteAvgOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
  }

  export type CaseVoteMaxOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    jurorAddr?: SortOrder
    vote?: SortOrder
    timestamp?: SortOrder
  }

  export type CaseVoteMinOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
    jurorAddr?: SortOrder
    vote?: SortOrder
    timestamp?: SortOrder
  }

  export type CaseVoteSumOrderByAggregateInput = {
    id?: SortOrder
    caseId?: SortOrder
  }

  export type JurorCountOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    xlmStake?: SortOrder
    platformStake?: SortOrder
    registeredAt?: SortOrder
    isActive?: SortOrder
  }

  export type JurorAvgOrderByAggregateInput = {
    id?: SortOrder
    xlmStake?: SortOrder
    platformStake?: SortOrder
  }

  export type JurorMaxOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    xlmStake?: SortOrder
    platformStake?: SortOrder
    registeredAt?: SortOrder
    isActive?: SortOrder
  }

  export type JurorMinOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    xlmStake?: SortOrder
    platformStake?: SortOrder
    registeredAt?: SortOrder
    isActive?: SortOrder
  }

  export type JurorSumOrderByAggregateInput = {
    id?: SortOrder
    xlmStake?: SortOrder
    platformStake?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type IdentityCountOrderByAggregateInput = {
    id?: SortOrder
    identityId?: SortOrder
    commitmentHash?: SortOrder
    isCommitted?: SortOrder
    isRevealed?: SortOrder
    linkedCaseId?: SortOrder
    backendRef?: SortOrder
    revealedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IdentityAvgOrderByAggregateInput = {
    id?: SortOrder
    linkedCaseId?: SortOrder
  }

  export type IdentityMaxOrderByAggregateInput = {
    id?: SortOrder
    identityId?: SortOrder
    commitmentHash?: SortOrder
    isCommitted?: SortOrder
    isRevealed?: SortOrder
    linkedCaseId?: SortOrder
    backendRef?: SortOrder
    revealedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IdentityMinOrderByAggregateInput = {
    id?: SortOrder
    identityId?: SortOrder
    commitmentHash?: SortOrder
    isCommitted?: SortOrder
    isRevealed?: SortOrder
    linkedCaseId?: SortOrder
    backendRef?: SortOrder
    revealedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IdentitySumOrderByAggregateInput = {
    id?: SortOrder
    linkedCaseId?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    wallet?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    wallet?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    wallet?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    wallet?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    read?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    wallet?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    wallet?: SortOrder
    type?: SortOrder
    title?: SortOrder
    body?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type IndexerCursorCountOrderByAggregateInput = {
    id?: SortOrder
    lastLedgerSeq?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexerCursorAvgOrderByAggregateInput = {
    lastLedgerSeq?: SortOrder
  }

  export type IndexerCursorMaxOrderByAggregateInput = {
    id?: SortOrder
    lastLedgerSeq?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexerCursorMinOrderByAggregateInput = {
    id?: SortOrder
    lastLedgerSeq?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexerCursorSumOrderByAggregateInput = {
    lastLedgerSeq?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type CaseJurorCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseJurorCreateWithoutCaseInput, CaseJurorUncheckedCreateWithoutCaseInput> | CaseJurorCreateWithoutCaseInput[] | CaseJurorUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseJurorCreateOrConnectWithoutCaseInput | CaseJurorCreateOrConnectWithoutCaseInput[]
    createMany?: CaseJurorCreateManyCaseInputEnvelope
    connect?: CaseJurorWhereUniqueInput | CaseJurorWhereUniqueInput[]
  }

  export type CaseVoteCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseVoteCreateWithoutCaseInput, CaseVoteUncheckedCreateWithoutCaseInput> | CaseVoteCreateWithoutCaseInput[] | CaseVoteUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseVoteCreateOrConnectWithoutCaseInput | CaseVoteCreateOrConnectWithoutCaseInput[]
    createMany?: CaseVoteCreateManyCaseInputEnvelope
    connect?: CaseVoteWhereUniqueInput | CaseVoteWhereUniqueInput[]
  }

  export type CaseJurorUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseJurorCreateWithoutCaseInput, CaseJurorUncheckedCreateWithoutCaseInput> | CaseJurorCreateWithoutCaseInput[] | CaseJurorUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseJurorCreateOrConnectWithoutCaseInput | CaseJurorCreateOrConnectWithoutCaseInput[]
    createMany?: CaseJurorCreateManyCaseInputEnvelope
    connect?: CaseJurorWhereUniqueInput | CaseJurorWhereUniqueInput[]
  }

  export type CaseVoteUncheckedCreateNestedManyWithoutCaseInput = {
    create?: XOR<CaseVoteCreateWithoutCaseInput, CaseVoteUncheckedCreateWithoutCaseInput> | CaseVoteCreateWithoutCaseInput[] | CaseVoteUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseVoteCreateOrConnectWithoutCaseInput | CaseVoteCreateOrConnectWithoutCaseInput[]
    createMany?: CaseVoteCreateManyCaseInputEnvelope
    connect?: CaseVoteWhereUniqueInput | CaseVoteWhereUniqueInput[]
  }

  export type CaseJurorUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseJurorCreateWithoutCaseInput, CaseJurorUncheckedCreateWithoutCaseInput> | CaseJurorCreateWithoutCaseInput[] | CaseJurorUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseJurorCreateOrConnectWithoutCaseInput | CaseJurorCreateOrConnectWithoutCaseInput[]
    upsert?: CaseJurorUpsertWithWhereUniqueWithoutCaseInput | CaseJurorUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseJurorCreateManyCaseInputEnvelope
    set?: CaseJurorWhereUniqueInput | CaseJurorWhereUniqueInput[]
    disconnect?: CaseJurorWhereUniqueInput | CaseJurorWhereUniqueInput[]
    delete?: CaseJurorWhereUniqueInput | CaseJurorWhereUniqueInput[]
    connect?: CaseJurorWhereUniqueInput | CaseJurorWhereUniqueInput[]
    update?: CaseJurorUpdateWithWhereUniqueWithoutCaseInput | CaseJurorUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseJurorUpdateManyWithWhereWithoutCaseInput | CaseJurorUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseJurorScalarWhereInput | CaseJurorScalarWhereInput[]
  }

  export type CaseVoteUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseVoteCreateWithoutCaseInput, CaseVoteUncheckedCreateWithoutCaseInput> | CaseVoteCreateWithoutCaseInput[] | CaseVoteUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseVoteCreateOrConnectWithoutCaseInput | CaseVoteCreateOrConnectWithoutCaseInput[]
    upsert?: CaseVoteUpsertWithWhereUniqueWithoutCaseInput | CaseVoteUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseVoteCreateManyCaseInputEnvelope
    set?: CaseVoteWhereUniqueInput | CaseVoteWhereUniqueInput[]
    disconnect?: CaseVoteWhereUniqueInput | CaseVoteWhereUniqueInput[]
    delete?: CaseVoteWhereUniqueInput | CaseVoteWhereUniqueInput[]
    connect?: CaseVoteWhereUniqueInput | CaseVoteWhereUniqueInput[]
    update?: CaseVoteUpdateWithWhereUniqueWithoutCaseInput | CaseVoteUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseVoteUpdateManyWithWhereWithoutCaseInput | CaseVoteUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseVoteScalarWhereInput | CaseVoteScalarWhereInput[]
  }

  export type CaseJurorUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseJurorCreateWithoutCaseInput, CaseJurorUncheckedCreateWithoutCaseInput> | CaseJurorCreateWithoutCaseInput[] | CaseJurorUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseJurorCreateOrConnectWithoutCaseInput | CaseJurorCreateOrConnectWithoutCaseInput[]
    upsert?: CaseJurorUpsertWithWhereUniqueWithoutCaseInput | CaseJurorUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseJurorCreateManyCaseInputEnvelope
    set?: CaseJurorWhereUniqueInput | CaseJurorWhereUniqueInput[]
    disconnect?: CaseJurorWhereUniqueInput | CaseJurorWhereUniqueInput[]
    delete?: CaseJurorWhereUniqueInput | CaseJurorWhereUniqueInput[]
    connect?: CaseJurorWhereUniqueInput | CaseJurorWhereUniqueInput[]
    update?: CaseJurorUpdateWithWhereUniqueWithoutCaseInput | CaseJurorUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseJurorUpdateManyWithWhereWithoutCaseInput | CaseJurorUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseJurorScalarWhereInput | CaseJurorScalarWhereInput[]
  }

  export type CaseVoteUncheckedUpdateManyWithoutCaseNestedInput = {
    create?: XOR<CaseVoteCreateWithoutCaseInput, CaseVoteUncheckedCreateWithoutCaseInput> | CaseVoteCreateWithoutCaseInput[] | CaseVoteUncheckedCreateWithoutCaseInput[]
    connectOrCreate?: CaseVoteCreateOrConnectWithoutCaseInput | CaseVoteCreateOrConnectWithoutCaseInput[]
    upsert?: CaseVoteUpsertWithWhereUniqueWithoutCaseInput | CaseVoteUpsertWithWhereUniqueWithoutCaseInput[]
    createMany?: CaseVoteCreateManyCaseInputEnvelope
    set?: CaseVoteWhereUniqueInput | CaseVoteWhereUniqueInput[]
    disconnect?: CaseVoteWhereUniqueInput | CaseVoteWhereUniqueInput[]
    delete?: CaseVoteWhereUniqueInput | CaseVoteWhereUniqueInput[]
    connect?: CaseVoteWhereUniqueInput | CaseVoteWhereUniqueInput[]
    update?: CaseVoteUpdateWithWhereUniqueWithoutCaseInput | CaseVoteUpdateWithWhereUniqueWithoutCaseInput[]
    updateMany?: CaseVoteUpdateManyWithWhereWithoutCaseInput | CaseVoteUpdateManyWithWhereWithoutCaseInput[]
    deleteMany?: CaseVoteScalarWhereInput | CaseVoteScalarWhereInput[]
  }

  export type JuryCaseCreateNestedOneWithoutJurorsInput = {
    create?: XOR<JuryCaseCreateWithoutJurorsInput, JuryCaseUncheckedCreateWithoutJurorsInput>
    connectOrCreate?: JuryCaseCreateOrConnectWithoutJurorsInput
    connect?: JuryCaseWhereUniqueInput
  }

  export type JuryCaseUpdateOneRequiredWithoutJurorsNestedInput = {
    create?: XOR<JuryCaseCreateWithoutJurorsInput, JuryCaseUncheckedCreateWithoutJurorsInput>
    connectOrCreate?: JuryCaseCreateOrConnectWithoutJurorsInput
    upsert?: JuryCaseUpsertWithoutJurorsInput
    connect?: JuryCaseWhereUniqueInput
    update?: XOR<XOR<JuryCaseUpdateToOneWithWhereWithoutJurorsInput, JuryCaseUpdateWithoutJurorsInput>, JuryCaseUncheckedUpdateWithoutJurorsInput>
  }

  export type JuryCaseCreateNestedOneWithoutVotesInput = {
    create?: XOR<JuryCaseCreateWithoutVotesInput, JuryCaseUncheckedCreateWithoutVotesInput>
    connectOrCreate?: JuryCaseCreateOrConnectWithoutVotesInput
    connect?: JuryCaseWhereUniqueInput
  }

  export type JuryCaseUpdateOneRequiredWithoutVotesNestedInput = {
    create?: XOR<JuryCaseCreateWithoutVotesInput, JuryCaseUncheckedCreateWithoutVotesInput>
    connectOrCreate?: JuryCaseCreateOrConnectWithoutVotesInput
    upsert?: JuryCaseUpsertWithoutVotesInput
    connect?: JuryCaseWhereUniqueInput
    update?: XOR<XOR<JuryCaseUpdateToOneWithWhereWithoutVotesInput, JuryCaseUpdateWithoutVotesInput>, JuryCaseUncheckedUpdateWithoutVotesInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CaseJurorCreateWithoutCaseInput = {
    jurorAddr: string
    assignedAt?: Date | string
  }

  export type CaseJurorUncheckedCreateWithoutCaseInput = {
    id?: number
    jurorAddr: string
    assignedAt?: Date | string
  }

  export type CaseJurorCreateOrConnectWithoutCaseInput = {
    where: CaseJurorWhereUniqueInput
    create: XOR<CaseJurorCreateWithoutCaseInput, CaseJurorUncheckedCreateWithoutCaseInput>
  }

  export type CaseJurorCreateManyCaseInputEnvelope = {
    data: CaseJurorCreateManyCaseInput | CaseJurorCreateManyCaseInput[]
    skipDuplicates?: boolean
  }

  export type CaseVoteCreateWithoutCaseInput = {
    jurorAddr: string
    vote: string
    timestamp?: Date | string
  }

  export type CaseVoteUncheckedCreateWithoutCaseInput = {
    id?: number
    jurorAddr: string
    vote: string
    timestamp?: Date | string
  }

  export type CaseVoteCreateOrConnectWithoutCaseInput = {
    where: CaseVoteWhereUniqueInput
    create: XOR<CaseVoteCreateWithoutCaseInput, CaseVoteUncheckedCreateWithoutCaseInput>
  }

  export type CaseVoteCreateManyCaseInputEnvelope = {
    data: CaseVoteCreateManyCaseInput | CaseVoteCreateManyCaseInput[]
    skipDuplicates?: boolean
  }

  export type CaseJurorUpsertWithWhereUniqueWithoutCaseInput = {
    where: CaseJurorWhereUniqueInput
    update: XOR<CaseJurorUpdateWithoutCaseInput, CaseJurorUncheckedUpdateWithoutCaseInput>
    create: XOR<CaseJurorCreateWithoutCaseInput, CaseJurorUncheckedCreateWithoutCaseInput>
  }

  export type CaseJurorUpdateWithWhereUniqueWithoutCaseInput = {
    where: CaseJurorWhereUniqueInput
    data: XOR<CaseJurorUpdateWithoutCaseInput, CaseJurorUncheckedUpdateWithoutCaseInput>
  }

  export type CaseJurorUpdateManyWithWhereWithoutCaseInput = {
    where: CaseJurorScalarWhereInput
    data: XOR<CaseJurorUpdateManyMutationInput, CaseJurorUncheckedUpdateManyWithoutCaseInput>
  }

  export type CaseJurorScalarWhereInput = {
    AND?: CaseJurorScalarWhereInput | CaseJurorScalarWhereInput[]
    OR?: CaseJurorScalarWhereInput[]
    NOT?: CaseJurorScalarWhereInput | CaseJurorScalarWhereInput[]
    id?: IntFilter<"CaseJuror"> | number
    caseId?: IntFilter<"CaseJuror"> | number
    jurorAddr?: StringFilter<"CaseJuror"> | string
    assignedAt?: DateTimeFilter<"CaseJuror"> | Date | string
  }

  export type CaseVoteUpsertWithWhereUniqueWithoutCaseInput = {
    where: CaseVoteWhereUniqueInput
    update: XOR<CaseVoteUpdateWithoutCaseInput, CaseVoteUncheckedUpdateWithoutCaseInput>
    create: XOR<CaseVoteCreateWithoutCaseInput, CaseVoteUncheckedCreateWithoutCaseInput>
  }

  export type CaseVoteUpdateWithWhereUniqueWithoutCaseInput = {
    where: CaseVoteWhereUniqueInput
    data: XOR<CaseVoteUpdateWithoutCaseInput, CaseVoteUncheckedUpdateWithoutCaseInput>
  }

  export type CaseVoteUpdateManyWithWhereWithoutCaseInput = {
    where: CaseVoteScalarWhereInput
    data: XOR<CaseVoteUpdateManyMutationInput, CaseVoteUncheckedUpdateManyWithoutCaseInput>
  }

  export type CaseVoteScalarWhereInput = {
    AND?: CaseVoteScalarWhereInput | CaseVoteScalarWhereInput[]
    OR?: CaseVoteScalarWhereInput[]
    NOT?: CaseVoteScalarWhereInput | CaseVoteScalarWhereInput[]
    id?: IntFilter<"CaseVote"> | number
    caseId?: IntFilter<"CaseVote"> | number
    jurorAddr?: StringFilter<"CaseVote"> | string
    vote?: StringFilter<"CaseVote"> | string
    timestamp?: DateTimeFilter<"CaseVote"> | Date | string
  }

  export type JuryCaseCreateWithoutJurorsInput = {
    caseId: number
    status?: string
    forVotes?: number
    againstVotes?: number
    totalVotes?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    votes?: CaseVoteCreateNestedManyWithoutCaseInput
  }

  export type JuryCaseUncheckedCreateWithoutJurorsInput = {
    id?: number
    caseId: number
    status?: string
    forVotes?: number
    againstVotes?: number
    totalVotes?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    votes?: CaseVoteUncheckedCreateNestedManyWithoutCaseInput
  }

  export type JuryCaseCreateOrConnectWithoutJurorsInput = {
    where: JuryCaseWhereUniqueInput
    create: XOR<JuryCaseCreateWithoutJurorsInput, JuryCaseUncheckedCreateWithoutJurorsInput>
  }

  export type JuryCaseUpsertWithoutJurorsInput = {
    update: XOR<JuryCaseUpdateWithoutJurorsInput, JuryCaseUncheckedUpdateWithoutJurorsInput>
    create: XOR<JuryCaseCreateWithoutJurorsInput, JuryCaseUncheckedCreateWithoutJurorsInput>
    where?: JuryCaseWhereInput
  }

  export type JuryCaseUpdateToOneWithWhereWithoutJurorsInput = {
    where?: JuryCaseWhereInput
    data: XOR<JuryCaseUpdateWithoutJurorsInput, JuryCaseUncheckedUpdateWithoutJurorsInput>
  }

  export type JuryCaseUpdateWithoutJurorsInput = {
    caseId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    forVotes?: IntFieldUpdateOperationsInput | number
    againstVotes?: IntFieldUpdateOperationsInput | number
    totalVotes?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    votes?: CaseVoteUpdateManyWithoutCaseNestedInput
  }

  export type JuryCaseUncheckedUpdateWithoutJurorsInput = {
    id?: IntFieldUpdateOperationsInput | number
    caseId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    forVotes?: IntFieldUpdateOperationsInput | number
    againstVotes?: IntFieldUpdateOperationsInput | number
    totalVotes?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    votes?: CaseVoteUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type JuryCaseCreateWithoutVotesInput = {
    caseId: number
    status?: string
    forVotes?: number
    againstVotes?: number
    totalVotes?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    jurors?: CaseJurorCreateNestedManyWithoutCaseInput
  }

  export type JuryCaseUncheckedCreateWithoutVotesInput = {
    id?: number
    caseId: number
    status?: string
    forVotes?: number
    againstVotes?: number
    totalVotes?: number
    resolvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    jurors?: CaseJurorUncheckedCreateNestedManyWithoutCaseInput
  }

  export type JuryCaseCreateOrConnectWithoutVotesInput = {
    where: JuryCaseWhereUniqueInput
    create: XOR<JuryCaseCreateWithoutVotesInput, JuryCaseUncheckedCreateWithoutVotesInput>
  }

  export type JuryCaseUpsertWithoutVotesInput = {
    update: XOR<JuryCaseUpdateWithoutVotesInput, JuryCaseUncheckedUpdateWithoutVotesInput>
    create: XOR<JuryCaseCreateWithoutVotesInput, JuryCaseUncheckedCreateWithoutVotesInput>
    where?: JuryCaseWhereInput
  }

  export type JuryCaseUpdateToOneWithWhereWithoutVotesInput = {
    where?: JuryCaseWhereInput
    data: XOR<JuryCaseUpdateWithoutVotesInput, JuryCaseUncheckedUpdateWithoutVotesInput>
  }

  export type JuryCaseUpdateWithoutVotesInput = {
    caseId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    forVotes?: IntFieldUpdateOperationsInput | number
    againstVotes?: IntFieldUpdateOperationsInput | number
    totalVotes?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jurors?: CaseJurorUpdateManyWithoutCaseNestedInput
  }

  export type JuryCaseUncheckedUpdateWithoutVotesInput = {
    id?: IntFieldUpdateOperationsInput | number
    caseId?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    forVotes?: IntFieldUpdateOperationsInput | number
    againstVotes?: IntFieldUpdateOperationsInput | number
    totalVotes?: IntFieldUpdateOperationsInput | number
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jurors?: CaseJurorUncheckedUpdateManyWithoutCaseNestedInput
  }

  export type CaseJurorCreateManyCaseInput = {
    id?: number
    jurorAddr: string
    assignedAt?: Date | string
  }

  export type CaseVoteCreateManyCaseInput = {
    id?: number
    jurorAddr: string
    vote: string
    timestamp?: Date | string
  }

  export type CaseJurorUpdateWithoutCaseInput = {
    jurorAddr?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseJurorUncheckedUpdateWithoutCaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    jurorAddr?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseJurorUncheckedUpdateManyWithoutCaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    jurorAddr?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseVoteUpdateWithoutCaseInput = {
    jurorAddr?: StringFieldUpdateOperationsInput | string
    vote?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseVoteUncheckedUpdateWithoutCaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    jurorAddr?: StringFieldUpdateOperationsInput | string
    vote?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CaseVoteUncheckedUpdateManyWithoutCaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    jurorAddr?: StringFieldUpdateOperationsInput | string
    vote?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}