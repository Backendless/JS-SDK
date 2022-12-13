import { HiveStore } from './base-store'
import { HiveTypes } from '../constants'
import Utils from '../../utils'
import { SetStore } from './set'
import { isHiveValueValid } from '../utils'

export class SortedSetStore extends HiveStore {

  static TYPE = HiveTypes.SORTED_SET

  static STATIC_METHODS = [...HiveStore.STATIC_METHODS, 'difference', 'intersection', 'union']

  static difference = SetStore.difference

  static intersection(keyNames) {
    if (!Array.isArray(keyNames)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.app.urls.hiveStore(this.hiveName, this.TYPE)}/action/intersection`,
        data: keyNames
      })
  }

  static union(keyNames) {
    if (!Array.isArray(keyNames)) {
      throw new Error('Store keys must be provided and must be an array.')
    }

    return this.app.request
      .post({
        url : `${this.app.urls.hiveStore(this.hiveName, this.TYPE)}/action/union`,
        data: keyNames
      })
  }

  add(items, options) {
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

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/add`,
        data: {
          items,
          ...options
        }
      })
  }

  incrementScore(value, scoreValue) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    if (isNaN(scoreValue) || typeof scoreValue !== 'number') {
      throw new Error('ScoreValue must be provided and must be a number.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/increment`,
        data: {
          scoreValue,
          value,
        }
      })
  }

  decrementScore(value, scoreValue) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    if (isNaN(scoreValue) || typeof scoreValue !== 'number') {
      throw new Error('ScoreValue must be provided and must be a number.')
    }

    return this.app.request
      .put({
        url : `${this.getBaseURL()}/decrement`,
        data: {
          scoreValue,
          value,
        }
      })
  }

  getAndDeleteMaxScore(count) {
    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/get-with-max-score-and-delete`,
        query: { count },
      })
  }

  getAndDeleteMinScore(count) {
    if (count !== undefined && (isNaN(count) || typeof count !== 'number')) {
      throw new Error('Count must be a number.')
    }

    return this.app.request
      .put({
        url  : `${this.getBaseURL()}/get-with-min-score-and-delete`,
        query: { count },
      })
  }

  getRandom(options) {
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
        url  : `${this.getBaseURL()}/get-random`,
        query: { ...options },
      })
  }

  getScore(value) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    return this.app.request
      .post({
        url : `${this.getBaseURL()}/get-score`,
        data: {
          value
        },
      })
  }

  getRank(value, reverse) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    if (reverse !== undefined && typeof reverse !== 'boolean') {
      throw new Error('Reverse argument must be a boolean.')
    }

    return this.app.request
      .post({
        url : `${this.getBaseURL()}/get-rank`,
        data: {
          value,
          reverse
        },
      })
  }

  getRangeByRank(startRank, stopRank, options) {
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
        url  : `${this.getBaseURL()}/get-range-by-rank`,
        query: { startRank, stopRank, ...options },
      })
  }

  getRangeByScore(options) {
    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { minScore, maxScore, minBound, maxBound, offset, pageSize, withScores, reverse } = options

      if (minScore !== undefined && (isNaN(minScore) || typeof minScore !== 'number')) {
        throw new Error('Minimal Score must be a number.')
      }

      if (maxScore !== undefined && (isNaN(maxScore) || typeof maxScore !== 'number')) {
        throw new Error('Maximal Score must be a number.')
      }

      if (minBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(minBound)) {
        throw new Error('Minimal bound must be one of this values: Include, Exclude, Infinity.')
      }

      if (maxBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(maxBound)) {
        throw new Error('Maximal bound must be one of this values: Include, Exclude, Infinity.')
      }

      if (offset !== undefined && (typeof offset !== 'number' || isNaN(offset))) {
        throw new Error('Offset must be a number.')
      }

      if (pageSize !== undefined && (typeof pageSize !== 'number' || isNaN(pageSize))) {
        throw new Error('Page Size must be a number.')
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
        url  : `${this.getBaseURL()}/get-range-by-score`,
        query: { ...options },
      })
  }

  deleteValue(value) {
    if (!isHiveValueValid(value)) {
      throw new Error('Value must be provided and must be one of types: string, number, boolean, object, array.')
    }

    return this.app.request
      .delete({
        url : `${this.getBaseURL()}/values`,
        data: [value]
      })
  }

  deleteValues(values) {
    if (!values || !Array.isArray(values) || !values.length || !isHiveValueValid(values)) {
      throw new Error('Value must be provided and must be a list of JSON items.')
    }

    return this.app.request
      .delete({
        url : `${this.getBaseURL()}/values`,
        data: values
      })
  }

  deleteValuesByRank(startRank, stopRank) {
    if (isNaN(startRank) || typeof startRank !== 'number') {
      throw new Error('Start Rank must be provided and must be a number.')
    }

    if (isNaN(stopRank) || typeof stopRank !== 'number') {
      throw new Error('Stop Rank must be provided and must be a number.')
    }

    return this.app.request
      .delete({
        url  : `${this.getBaseURL()}/delete-by-rank`,
        query: { startRank, stopRank },
      })
  }

  deleteValuesByScore(options) {
    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { minScore, maxScore, minBound, maxBound } = options

      if (minScore !== undefined && (isNaN(minScore) || typeof minScore !== 'number')) {
        throw new Error('Minimal Score must be a number.')
      }

      if (maxScore !== undefined && (isNaN(maxScore) || typeof maxScore !== 'number')) {
        throw new Error('Maximal Score must be a number.')
      }

      if (minBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(minBound)) {
        throw new Error('Minimal bound must be one of this values: Include, Exclude, Infinity.')
      }

      if (maxBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(maxBound)) {
        throw new Error('Maximal bound must be one of this values: Include, Exclude, Infinity.')
      }
    }

    return this.app.request
      .delete({
        url  : `${this.getBaseURL()}/delete-by-score`,
        query: { ...options },
      })
  }

  length() {
    return this.app.request
      .get({
        url: `${this.getBaseURL()}/length`,
      })
  }

  countBetweenScores(options) {
    if (options !== undefined) {
      if (!Utils.isObject(options)) {
        throw new Error('Options must be an object.')
      }

      const { minScore, maxScore, minBound, maxBound } = options

      if (minScore !== undefined && (isNaN(minScore) || typeof minScore !== 'number')) {
        throw new Error('Minimal Score must be a number.')
      }

      if (maxScore !== undefined && (isNaN(maxScore) || typeof maxScore !== 'number')) {
        throw new Error('Maximal Score must be a number.')
      }

      if (minBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(minBound)) {
        throw new Error('Minimal bound must be one of this values: Include, Exclude, Infinity.')
      }

      if (maxBound !== undefined && !['Include', 'Exclude', 'Infinity'].includes(maxBound)) {
        throw new Error('Maximal bound must be one of this values: Include, Exclude, Infinity.')
      }
    }

    return this.app.request
      .get({
        url  : `${this.getBaseURL()}/count`,
        query: { ...options },
      })
  }
}
