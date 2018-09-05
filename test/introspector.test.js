const Introspector = require(__dirname + "/../src/introspector.js").Introspector;
const { expect, assert } = require("chai");

describe("Introspector class", function() {

  var getData1 = function() {
    return {
      a: {
        b: {
          c: {
            d: 404,
            e: 505,
            f: 606
          }
        }
      }
    }
  };

  var getData2 = function() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  };

  var getData3 = function() {
    return {
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      "10": 10,
      "11": 11,
      "12": 12,
      "13": 13,
      "14": 14,
      "15": 15
    };
  };

  it("Introspector.from({...}).get(selector[,defaultValue])", function(done) {

    const data1 = getData1();

    const fromData1 = Introspector.from(data1);

    var r1 = fromData1.get("a.b.c.d");
    var r2 = fromData1.get("a.b.c.e");
    var r3 = fromData1.get("a.b.c.f");
    var r4 = fromData1.get("a.b.c.g");
    var r5 = fromData1.get("a.b.c.g.j", null);
    var r6 = fromData1.get("a.b.c.g.j.k", -5);

    expect(r1).to.equal(404);
    expect(r2).to.equal(505);
    expect(r3).to.equal(606);
    expect(r4).to.equal(undefined);
    expect(r5).to.equal(null);
    expect(r6).to.equal(-5);

    done();

  });

  it("Introspector.from({...}).set(selector,value)", function(done) {

    const data1 = getData1();

    const fromData1 = Introspector.from(data1);

    fromData1.set("a.b.c.g", 707);
    fromData1.set("a.b.c.h", 808);
    fromData1.set("a.b.c.i", 909);
    fromData1.set("a.b.c.g.j.k", 1000);
    fromData1.set("a.b.c.g.j.l", 2000);
    fromData1.set("a.b.c.g.j.m", 3000);

    expect(fromData1.get("a.b.c.g")).to.equal(707);
    expect(fromData1.get("a.b.c.h")).to.equal(808);
    expect(fromData1.get("a.b.c.i")).to.equal(909);
    expect(fromData1.get("a.b.c.g.j.k")).to.equal(undefined);
    expect(fromData1.get("a.b.c.g.j.l")).to.equal(undefined);
    expect(fromData1.get("a.b.c.g.j.m")).to.equal(undefined);

    done();

  });

  it("Introspector.from({...}).force(selector,value)", function(done) {

    const data1 = getData1();

    const fromData1 = Introspector.from(data1);

    fromData1.force("a.b.c.g", 707);
    fromData1.force("a.b.c.h", 808);
    fromData1.force("a.b.c.i", 909);
    fromData1.force("a.b.c.g.j.k", 1000);
    fromData1.force("a.b.c.g.j.l", 2000);
    fromData1.force("a.b.c.g.j.m", 3000);

    expect(fromData1.get("a.b.c.g.$")).to.equal(707);
    expect(fromData1.get("a.b.c.h")).to.equal(808);
    expect(fromData1.get("a.b.c.i")).to.equal(909);
    expect(fromData1.get("a.b.c.g.j.k")).to.equal(1000);
    expect(fromData1.get("a.b.c.g.j.l")).to.equal(2000);
    expect(fromData1.get("a.b.c.g.j.m")).to.equal(3000);

    done();

  });

  it("Introspector.from({...}).iterate(fn[,initialValue])", function(done) {

    const data2 = getData2();

    const fromData2 = Introspector.from(data2);

    const r1 = fromData2
      .iterate(function(key, value, index, output, original) {
        expect(parseInt(key)).to.equal(index);
        expect(value).to.equal(index + 1);
      })
      .iterate((key, value, index, output, original) => output + value, 0);

    expect(r1).to.equal(15+14+13+12+11+10+9+8+7+6+5+4+3+2+1);

    done();

  });

});