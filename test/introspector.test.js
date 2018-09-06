const { Introspector, Inspectable } = require(__dirname + "/../src/introspector.js");
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
    fromData1.force("a.b.c.g.n.o", 4000);

    expect(fromData1.get("a.b.c.g.$")).to.equal(707);
    expect(fromData1.get("a.b.c.h")).to.equal(808);
    expect(fromData1.get("a.b.c.i")).to.equal(909);
    expect(fromData1.get("a.b.c.g.j.k")).to.equal(1000);
    expect(fromData1.get("a.b.c.g.j.l")).to.equal(2000);
    expect(fromData1.get("a.b.c.g.j.m")).to.equal(3000);
    expect(fromData1.get("a.b.c.g.n.o")).to.equal(4000);

    done();

  });

  it("Introspector.from({...}).iterate(fn[,initialValue])", function(done) {

    const data2 = getData2();

    const fromData2 = Introspector.from(data2);

    const r1 = fromData2
      .iterate(function(value, key, index, output, original) {
        expect(parseInt(key)).to.equal(index);
        expect(value).to.equal(index + 1);
      })
      .iterate((value, key, index, output, original) => output + value, 0);

    expect(r1).to.equal(15 + 14 + 13 + 12 + 11 + 10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1);

    done();

  });

  it("works correct for the example of the documentation", function(done) {
    const inspectable = Introspector.from([1, 2, 4, 8]);
    // Example with Inspectable#get(...)
    const value0 = inspectable.get(0); // > 1
    const value1 = inspectable.get(1); // > 2
    const value2 = inspectable.get(2); // > 4
    const value3 = inspectable.get(3); // > 8
    const value4 = inspectable.get(4); // > undefined
    const value5 = inspectable.get(5, null); // > null
    // Example with Inspectable#set(...)
    const set1 = inspectable.set(4, 16);
    const set2 = inspectable.set(5, 32);
    const set_value1 = inspectable.get(4); // > 16
    const set_value2 = inspectable.get(5); // > 32
    // Example with Inspectable#force(...)
    const force1 = inspectable.force(6, 64);
    const force2 = inspectable.force("6.a", 128);
    const force3 = inspectable.force("6.b", 256);
    const force_value1 = inspectable.get(6); // > { $:64, a:128, b:256 }
    const force_value2 = inspectable.get("6.a"); // > 128
    const force_value3 = inspectable.get("6.b"); // > 256
    // Example with Inspectable#iterate(...)
    const iterate1 = inspectable.iterate((v, k, i, r, o) => r + (typeof v === "number" ? v : 0), 0) // > 1+2+4+8+16+32
    const iterate2 = inspectable.iterate((v, k, i, r, o) => {});
    expect(value0).to.deep.equal(1);
    expect(value1).to.deep.equal(2);
    expect(value2).to.deep.equal(4);
    expect(value3).to.deep.equal(8);
    expect(value4).to.deep.equal(undefined);
    expect(value5).to.deep.equal(null);
    expect(set1).to.deep.equal(inspectable);
    expect(set2).to.deep.equal(inspectable);
    expect(set_value1).to.deep.equal(16);
    expect(set_value2).to.deep.equal(32);
    expect(force1).to.deep.equal(inspectable);
    expect(force2).to.deep.equal(inspectable);
    expect(force3).to.deep.equal(inspectable);
    expect(force_value1).to.deep.equal({ $: 64, a: 128, b: 256 });
    expect(force_value2).to.deep.equal(128);
    expect(force_value3).to.deep.equal(256);
    expect(iterate1).to.deep.equal(1 + 2 + 4 + 8 + 16 + 32);
    expect(iterate2).to.deep.equal(inspectable);
    done();
  });

  it("works when using Inspectable#get(...) for strings too", function(done) {
    const inspectable = Introspector.from("Hello!");
    const v1 = inspectable.get(0);
    const v2 = inspectable.get(1);
    const v3 = inspectable.get(2);
    const v4 = inspectable.get(3);
    const v5 = inspectable.get(4);
    const v6 = inspectable.get(5);
    expect(v1).to.deep.equal("H");
    expect(v2).to.deep.equal("e");
    expect(v3).to.deep.equal("l");
    expect(v4).to.deep.equal("l");
    expect(v5).to.deep.equal("o");
    expect(v6).to.deep.equal("!");
    const inspectable2 = Introspector.from({ msg: "Hello!" })
    const v1_ = inspectable2.get("msg.0");
    const v2_ = inspectable2.get("msg.1");
    const v3_ = inspectable2.get("msg.2");
    const v4_ = inspectable2.get("msg.3");
    const v5_ = inspectable2.get("msg.4");
    const v6_ = inspectable2.get("msg.5");
    expect(v1_).to.deep.equal("H");
    expect(v2_).to.deep.equal("e");
    expect(v3_).to.deep.equal("l");
    expect(v4_).to.deep.equal("l");
    expect(v5_).to.deep.equal("o");
    expect(v6_).to.deep.equal("!");
    done();
  });

  it("works when using Inspectable#iterate(...) for strings too", function(done) {
    const inspectable = Introspector.from("Hello!");
    var out = "";
    inspectable.iterate((v, k, i, r, o) => {
      switch (i) {
        case 0:
          out += "0";
          expect(v).to.equal("H");
          break;
        case 1:
          out += "1";
          expect(v).to.equal("e");
          break;
        case 2:
          out += "2";
          expect(v).to.equal("l");
          break;
        case 3:
          out += "3";
          expect(v).to.equal("l");
          break;
        case 4:
          out += "4";
          expect(v).to.equal("o");
          break;
        case 5:
          out += "5";
          expect(v).to.equal("!");
          break;
      }
    });
    setTimeout(() => {
      expect(out).to.equal("012345");
      done();
    }, 1000);
  });

  it("will throw Inspectable.Error from Inspectable#iterate(...) when Inspectable#data is other than an object, a string or a function", function(done) {
    var out = "";
    try {
      Introspector.from(100).iterate(() => {});
    } catch(e) {
      out += "0";
      expect(e instanceof Error).to.equal(true);
    }
    try {
      Introspector.from(true).iterate(() => {});
    } catch(e) {
      out += "1";
      expect(e instanceof Error).to.equal(true);
    }
    expect(out).to.equal("01");
    done();
  });

  it("can throw Error(s) through Inspectable.Error function", function(done) {
    const error = new Inspectable.Error("SomeError", "Some message", { message: "Some error happened" });
    expect(error instanceof Error).to.equal(true);
    done();
  });

});