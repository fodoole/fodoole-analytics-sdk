/**
 * @jest-environment jsdom
 */

import { randInt, limit, getElementPath } from '../src/utils.ts';
import { prepareSelectors } from '../src/sessionManager.ts';

describe('Utilities', () => {
  it('(Random Integer) should generate a random integer between 10^15 and 10^16 - 1', async () => {
    const randIntResult = randInt();

    expect(randIntResult).toBeGreaterThanOrEqual(1e15);
    expect(randIntResult).toBeLessThan(1e16);
    expect(typeof randIntResult).toBe('number');
  });

  it('(Limit) should limit a number to a given range', async () => {
    const limitResultAbove = limit(10, 0, 5);
    const limitResultBelow = limit(-10, 0, 5);
    const limitResultWithin = limit(3, 0, 5);

    expect(limitResultAbove).toBe(5);
    expect(limitResultBelow).toBe(0);
    expect(limitResultWithin).toBe(3);
  });

  it('(Prepare Selectors) should observe the correct content selector bindings', async () => {
    const contentSelectors = prepareSelectors([
      {
        'uid': '0001',
        'path': '.title',
        'value': 'Title'
      },
      {
        'uid': '0002',
        'path': '#desc',
        'value': 'Description'
      },
      {
        'uid': '0003',
        'path': 'html > head > title',
        'value': 'Document Title'
      }]);

    expect(contentSelectors).toEqual({
      '.title': 'Title',
      '#desc': 'Description',
      'html > head > title': 'Document Title',
    });
  });

  it('(Get Element Path: ID) should return the correct path for an element with an ID', () => {
    const div = document.createElement('div');
    div.id = 'test-id';
    document.body.appendChild(div);

    const path = getElementPath(div);
    expect(path).toBe('html > body > div#test-id');

    document.body.removeChild(div);
  });

  it('(Get Element Path: Class) should return the correct path for an element with classes', () => {
    const div = document.createElement('div');
    div.className = 'class1 class2';
    document.body.appendChild(div);

    const path = getElementPath(div);
    expect(path).toBe('html > body > div.class1.class2');

    document.body.removeChild(div);
  });

  it('(Get Element Path: Nested) should return the correct path for a nested element', () => {
    const parentDiv = document.createElement('div');
    const childDiv = document.createElement('div');
    parentDiv.appendChild(childDiv);
    document.body.appendChild(parentDiv);

    const path = getElementPath(childDiv);
    expect(path).toBe('html > body > div > div');

    document.body.removeChild(parentDiv);
  });

  it('(Get Element Path: Siblings) should return the correct path for an element with siblings', () => {
    const parentDiv = document.createElement('div');
    const firstChild = document.createElement('div');
    const secondChild = document.createElement('div');
    parentDiv.appendChild(firstChild);
    parentDiv.appendChild(secondChild);
    document.body.appendChild(parentDiv);

    const path = getElementPath(secondChild);
    expect(path).toBe('html > body > div > div:nth-child(2)');

    document.body.removeChild(parentDiv);
  });
});
