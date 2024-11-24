class Collision {
    private static updateVelocities(a: Ball, b: Ball, μ: number) {
      const ab = b.pos.clone().sub(a.pos).normalize();
      const abTangent = upCross(ab);
      const vRel = a.vel.clone().sub(b.vel);
      const vRelTangent = vRel.dot(abTangent);
      const vRelNormal = vRel.dot(ab);
      const ωaTangent = a.rvel.dot(abTangent);
      const ωaNormal = a.rvel.dot(ab);
      const ωbTangent = b.rvel.dot(abTangent);
      const ωbNormal = b.rvel.dot(ab);
  
      const vRelContactTangent = vRelTangent + R * (ωaTangent - ωbTangent);
      const vRelContactNormal = vRelNormal;
      const vRelContact = Math.sqrt(vRelContactTangent ** 2 + (R * (a.rvel.dot(upCross(abTangent)))) ** 2);
  
      const vT = Math.min(μ * vRelContact, vRelContactTangent);
      const vN = vRelContactNormal;
  
      const θThrow = Math.atan2(vT, vN);
  
      const vBt = vRelContactTangent;
      const vBn = vRelContactNormal;
      const vBk = R * a.rvel.dot(upCross(abTangent));
  
      const eT = vBt / vRelContact;
      const eK = vBk / vRelContact;
  
      const fN = m * vRelContactNormal;
      const fT = μ * fN * eT;
  
      const vOBt = fT / m;
      const vOBn = fN / m;
  
      const θOB = Math.atan2(vOBt, vOBn);
  
      // Update velocities
      a.vel.addScaledVector(abTangent, -vOBt);
      a.vel.addScaledVector(ab, -vOBn);
      b.vel.addScaledVector(abTangent, vOBt);
      b.vel.addScaledVector(ab, vOBn);
  
      // Update angular velocities
      a.rvel.addScaledVector(upCross(abTangent), -vOBt / R);
      b.rvel.addScaledVector(upCross(abTangent), vOBt / R);
    }
  }
  
  function upCross(v: Vector3) {
    return new Vector3(-v.z, 0, v.x);
  }