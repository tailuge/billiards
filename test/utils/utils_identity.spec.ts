import { expect } from "chai";
import { getOriginalIdentity } from "../../src/utils/utils";
import { Rematch } from "../../src/network/client/rematch";

describe("utils identity", () => {
  const originalLocation = globalThis.location;

  it("should extract identity from URL params", () => {
    const identity = getOriginalIdentity("?userId=u1&userName=n1");
    expect(identity.userId).to.equal("u1");
    expect(identity.userName).to.equal("n1");
  });

  it("should handle alternative parameter names", () => {
    const identity = getOriginalIdentity("?clientId=c1&name=m1");
    expect(identity.userId).to.equal("c1");
    expect(identity.userName).to.equal("m1");
  });

  it("should handle playername parameter", () => {
    const identity = getOriginalIdentity("?playername=p1");
    expect(identity.userName).to.equal("p1");
  });

  it("should return null if params are missing", () => {
    const identity = getOriginalIdentity("");
    expect(identity.userId).to.be.null;
    expect(identity.userName).to.be.null;
  });

});
