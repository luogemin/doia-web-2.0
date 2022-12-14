
import { LocalStorageUtils } from './localStorageUtils';

describe('LocalStorageUtils', () => {
  let localStorageUtils;
  beforeEach(() => {
    localStorageUtils = new LocalStorageUtils();
  });

  describe('#setTransformValue', () => {
    beforeEach(() => {
      sinon.stub(localStorageUtils, 'setApp');
    });

    it('should create #transform if we have not #transform field in local storage', () => {
      sinon.stub(localStorageUtils, 'getApp').returns({});
      localStorageUtils.setTransformValue({columnType: 'TEXT', toType: 'INTEGER', text: 123});
      expect(localStorageUtils.setApp).to.be.calledWith({
        transform: {
          TEXT: {
            INTEGER: {
              text: 123
            }
          }
        }
      });
    });

    it('should create columnType field in #transform if we have not columnType field in app.transform', () => {
      sinon.stub(localStorageUtils, 'getApp').returns({ transform: {} });
      localStorageUtils.setTransformValue({columnType: 'DATE', toType: 'TEXT', dropSourceField: true});
      expect(localStorageUtils.setApp).to.be.calledWith({
        transform: {
          DATE: {
            TEXT: {
              dropSourceField: true
            }
          }
        }
      });
    });

    it('should rewrite existing chain of transform', () => {
      const existingTransform = {
        transform: {
          TEXT: {
            FLOAT: {
              dropSourceField: false,
              defaultValue: '1234',
              format: 'mm.dd.yy'
            }
          }
        }
      };
      sinon.stub(localStorageUtils, 'getApp').returns(existingTransform);
      const values = {
        columnType: 'TEXT',
        toType: 'FLOAT',
        dropSourceField: true,
        defaultValue: 'abc',
        format: 'mdy'
      };
      localStorageUtils.setTransformValue(values);
      expect(localStorageUtils.setApp).to.be.calledWith({
        transform: {
          TEXT: {
            FLOAT: {
              dropSourceField: true,
              defaultValue: 'abc',
              format: 'mdy'
            }
          }
        }
      });
    });
  });
});
