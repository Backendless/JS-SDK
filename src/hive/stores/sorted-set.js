import { HiveStore } from './base-store'
import { HiveTypes } from '../constants'
import Utils from '../../utils'

export class SortedSetStore extends HiveStore {
  constructor(dataStore, storeKey) {
    super(dataStore, HiveTypes.SORTED_SET)

    this.storeKey = storeKey
  }

  add(items, options) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!items || !Array.isArray(items)) {
      throw new Error('Items must be provided and must be an array.')
    }

    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { duplicateBehaviour, scoreUpdateMode, resultType } = options

      if (duplicateBehaviour !== undefined && !['OnlyUpdate', 'AlwaysAdd'].includes(duplicateBehaviour)) {
        throw new Error('Duplicate Behaviour argument must be one of this values: OnlyUpdate, AlwaysAdd.')
      }

      if (scoreUpdateMode !== undefined && !['Greater', 'Less'].includes(scoreUpdateMode)) {
        throw new Error('Score Update Mode argument must be one of this values: Greater, Less.')
      }

      if (resultType !== undefined && !['NewAdded', 'TotalChanged'].includes(resultType)) {
        throw new Error('Result Type must be one of this values: NewAdded, TotalChanged.')
      }
    }

    //TODO: Waining for BKNDLSS-28543
    return this.app.request
      .put({
        url : `${this.storeUrl}/${this.storeKey}/add`,
        data: {
          items,
          ...options
        }
      })
  }

  set(items, options) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!items || !Array.isArray(items)) {
      throw new Error('Items must be provided and must be an array.')
    }

    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { duplicateBehaviour, scoreUpdateMode, resultType } = options

      if (duplicateBehaviour !== undefined && !['OnlyUpdate', 'AlwaysAdd'].includes(duplicateBehaviour)) {
        throw new Error('Duplicate Behaviour argument must be one of this values: OnlyUpdate, AlwaysAdd.')
      }

      if (scoreUpdateMode !== undefined && !['Greater', 'Less'].includes(scoreUpdateMode)) {
        throw new Error('Score Update Mode argument must be one of this values: Greater, Less.')
      }

      if (resultType !== undefined && !['NewAdded', 'TotalChanged'].includes(resultType)) {
        throw new Error('Result Type must be one of this values: NewAdded, TotalChanged.')
      }
    }

    //TODO: Waining for BKNDLSS-28543
    return this.app.request
      .put({
        url : `${this.storeUrl}/${this.storeKey}`,
        data: {
          items,
          ...options
        }
      })
  }

  incrementScore(value, count) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    if (isNaN(count) || typeof count !== 'number') {
      throw new Error('Count must be provided and must be a number.')
    }

    return this.app.request
      .put({
        url : `${this.storeUrl}/${this.storeKey}/increment`,
        data: {
          scoreAmount: count,
          member     : value,
        }
      })
  }

  getAndRemoveMaxScore(count) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.storeUrl}/${this.storeKey}/get-first-and-remove`,
        query: { count },
      })
  }

  getAndRemoveMinScore(count) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.storeUrl}/${this.storeKey}/get-last-and-remove`,
        query: { count },
      })
  }

  getRandom(options) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { count, withScores } = options

      if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
        throw new Error('Count must be a number.')
      }

      if (withScores !== undefined && typeof withScores !== 'boolean') {
        throw new Error('With Scores argument must be a boolean.')
      }
    }

    return this.app.request
      .get({
        url  : `${this.storeUrl}/${this.storeKey}/get-random`,
        query: { ...options },
      })
  }

  getScore(value) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    return this.app.request
      .post({
        url    : `${this.storeUrl}/${this.storeKey}/get-score`,
        headers: { 'Content-Type': 'text/plain' },
        data   : value,
      })

  }

  getRank(value, reverse) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!value || typeof value !== 'string') {
      throw new Error('Value must be provided and must be a string.')
    }

    if (reverse !== undefined && typeof reverse !== 'boolean') {
      throw new Error('Reverse argument must be a boolean.')
    }

    return this.app.request
      .post({
        url    : `${this.storeUrl}/${this.storeKey}/get-rank`,
        headers: { 'Content-Type': 'text/plain' },
        query  : { reverse },
        data   : value,
      })
  }

  getRangeByRank(startRank, stopRank, options) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (isNaN(startRank) || typeof startRank !== 'number') {
      throw new Error('Start Rank must be provided and must be a number.')
    }

    if (isNaN(stopRank) || typeof stopRank !== 'number') {
      throw new Error('Stop Rank must be provided and must be a number.')
    }

    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { withScores, reverse } = options

      if (withScores !== undefined && typeof withScores !== 'boolean') {
        throw new Error('With Scores argument must be a boolean.')
      }

      if (reverse !== undefined && typeof reverse !== 'boolean') {
        throw new Error('Reverse argument must be a boolean.')
      }
    }

    return this.app.request
      .get({
        url  : `${this.storeUrl}/${this.storeKey}/get-range-by-rank`,
        query: { startRank, stopRank, ...options },
      })
  }

  getRangeByScore(minScore, maxScore, options) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (isNaN(minScore) || typeof minScore !== 'number') {
      throw new Error('Minimal Score must be provided and must be a number.')
    }

    if (isNaN(maxScore) || typeof maxScore !== 'number') {
      throw new Error('Maximal Score must be provided and must be a number.')
    }

    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { minBound, maxBound, offset, count, withScores, reverse } = options

      if (minBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(minBound)) {
        throw new Error('Minimal bound must be one of this values: Include, Exclude, Infinity.')
      }

      if (maxBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(maxBound)) {
        throw new Error('Maximal bound must be one of this values: Include, Exclude, Infinity.')
      }

      if (offset !== undefined && (typeof offset !== 'number' || isNaN(offset))) {
        throw new Error('Offset must be a number.')
      }

      if (count !== undefined && (typeof count !== 'number' || isNaN(count))) {
        throw new Error('Count must be a number.')
      }

      if (withScores !== undefined && typeof withScores !== 'boolean') {
        throw new Error('With Scores argument must be a boolean.')
      }

      if (reverse !== undefined && typeof reverse !== 'boolean') {
        throw new Error('Reverse argument must be a boolean.')
      }
    }

    return this.app.request
      .get({
        url  : `${this.storeUrl}/${this.storeKey}/get-range-by-score`,
        query: { minScore, maxScore, ...options },
      })
  }

  difference(storeKeys) {
    if (!storeKeys || !Array.isArray(storeKeys)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.storeUrl}/action/difference`,
        data: storeKeys
      })
  }

  intersection(storeKeys) {
    if (!storeKeys || !Array.isArray(storeKeys)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.storeUrl}/action/intersection`,
        data: storeKeys
      })
  }

  union(storeKeys) {
    if (!storeKeys || !Array.isArray(storeKeys)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.storeUrl}/action/union`,
        data: storeKeys
      })
  }

  removeValues(values) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (!values || !(typeof values === 'string' || Array.isArray(values))) {
      throw new Error('Value(s) must be provided and must be a string or list of strings.')
    }

    return this.app.request
      .delete({
        url : `${this.storeUrl}/${this.storeKey}/values`,
        data: Utils.castArray(values)
      })
  }

  removeValuesByRank(startRank, stopRank) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (isNaN(startRank) || typeof startRank !== 'number') {
      throw new Error('Start Rank must be provided and must be a number.')
    }

    if (isNaN(stopRank) || typeof stopRank !== 'number') {
      throw new Error('Stop Rank must be provided and must be a number.')
    }

    return this.app.request
      .delete({
        url  : `${this.storeUrl}/${this.storeKey}/remove-by-rank`,
        query: { startRank, stopRank },
      })
  }

  removeValuesByScore(minScore, maxScore, options) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (isNaN(minScore) || typeof minScore !== 'number') {
      throw new Error('Minimal Score must be provided and must be a number.')
    }

    if (isNaN(maxScore) || typeof maxScore !== 'number') {
      throw new Error('Maximal Score must be provided and must be a number.')
    }

    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { minBound, maxBound } = options

      if (minBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(minBound)) {
        throw new Error('Minimal bound must be one of this values: Include, Exclude, Infinity.')
      }

      if (maxBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(maxBound)) {
        throw new Error('Maximal bound must be one of this values: Include, Exclude, Infinity.')
      }
    }

    return this.app.request
      .delete({
        url  : `${this.storeUrl}/${this.storeKey}/remove-by-score`,
        query: { minScore, maxScore, ...options },
      })
  }

  length() {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    return this.app.request
      .get({
        url: `${this.storeUrl}/${this.storeKey}/length`,
      })
  }

  countBetweenScores(minScore, maxScore, options) {
    if (!this.storeKey) {
      throw new Error('Store must be created with store key.')
    }

    if (isNaN(minScore) || typeof minScore !== 'number') {
      throw new Error('Minimal Score must be provided and must be a number.')
    }

    if (isNaN(maxScore) || typeof maxScore !== 'number') {
      throw new Error('Maximal Score must be provided and must be a number.')
    }

    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { minBound, maxBound } = options

      if (minBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(minBound)) {
        throw new Error('Minimal bound must be one of this values: Include, Exclude, Infinity.')
      }

      if (maxBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(maxBound)) {
        throw new Error('Maximal bound must be one of this values: Include, Exclude, Infinity.')
      }
    }

    return this.app.request
      .get({
        url  : `${this.storeUrl}/${this.storeKey}/count`,
        query: { minScore, maxScore, ...options },
      })
  }
}
