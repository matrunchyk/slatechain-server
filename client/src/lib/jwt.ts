import { httpPost } from '@/lib/utils';
import jwtDecode from 'jwt-decode';
import RefreshTokenException from '@/models/Exceptions/RefreshTokenException';
import InvalidTokenException from '@/models/Exceptions/InvalidTokenException';
import { IJsonWebToken } from '@/index';

export default class JWT {
  /**
   * Name of JWT token
   *
   * @type {string}
   */
  public static tokenName = 'accessToken';

  /**
   * Name of JWT refresh token
   *
   * @type {string}
   */
  public static refreshTokenName = 'refreshToken';

  /**
   * Retrieves token from storage
   *
   * @param {string} item
   * @returns {string | null}
   */
  public static storageGet(item: string): string | null {
    return localStorage.getItem(item) || null;
  }

  /**
   * Saves token to storage
   *
   * @param {string} item
   * @param {string} value
   */
  public static storageSet(item: string, value: string): void {
    localStorage.setItem(item, value);
  }

  /**
   * Removes token from localStorage
   *
   * @param {string} item
   */
  public static storageRemove(item: string): void {
    localStorage.removeItem(item);
  }

  /**
   * Regenerates a new token via API and stores in a storage
   *
   * @returns {Promise<*>}
   * @throws {RefreshTokenException}
   */
  public static async apiRegenerate(): Promise<string> {
    const refreshToken = JWT.storageGet(JWT.refreshTokenName);
    const baseURL = process.env.API_HTTP;
    let accessToken;

    if (!refreshToken) {
      // No refresh token, clear `accessToken` too and throw
      JWT.clear();
      throw new RefreshTokenException('No refresh token available.');
    }

    try {
      // Retrieve token from API using refreshToken
      // @ts-ignore
      ({ accessToken } = await httpPost(`${baseURL}/auth/refreshToken`, { refreshToken }));
      // And store it
      JWT.storageSet(JWT.tokenName, accessToken);
    } catch (e) {
      // Unable to refresh token, clear and throw
      // JWT.clear();
      throw new RefreshTokenException(e);
    }
    return accessToken;
  }

  /**
   * Retrieves a token from a storage
   *
   * @returns {string | null | null}
   */
  public static getToken(): string | null {
    return JWT.storageGet(JWT.tokenName);
  }

  /**
   * Returns true if token is expired
   *
   * @returns {boolean}
   */
  public static isExpired(): boolean {
    // If token's TTL is in the past
    return (new Date()).getTime() >=
      JWT.getExpiryDate().getTime();
  }

  /**
   * Returns token expiration date from JWT header
   *
   * @link https://jwt.io/
   * @returns {*}
   */
  public static getExpiryDate(): Date {
    const encodedToken = JWT.getToken();

    if (!encodedToken) {
      return new Date(2019, 1, 1);
    }
    const token = jwtDecode<IJsonWebToken>(encodedToken);

    // If we cannot determine expiration date,
    // assume it as some default date in the past
    if (!token.exp) {
      return new Date(2019, 1, 1);
    }

    return new Date(token.exp * 1000);
  }

  /**
   * Retrieves and verifies a new access token
   *
   * @returns {Promise<void>}
   */
  public static async regenerate(): Promise<void> {
    await JWT.apiRegenerate();
    await JWT.verify();
  }

  /**
   * Checks if token is set and not expired
   *
   * @throws {InvalidTokenException}
   */
  public static verify(): void {
    const token = JWT.getToken();

    if (!token || JWT.isExpired()) {
      throw new InvalidTokenException();
    }
  }

  /**
   * Clears out all tokens
   */
  public static clear(): void {
    JWT.storageRemove(JWT.tokenName);
    JWT.storageRemove(JWT.refreshTokenName);
  }

  /**
   * Retrieves a token
   */
  public static async retrieve(): Promise<string | null> {
    try {
      this.verify();
    } catch (validationException) {
      // Token is not valid, let's try to obtain a new one
      await JWT.regenerate();
    }
    return JWT.getToken();
  }
}
