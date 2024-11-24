private static updateVelocities(a: Ball, b: Ball) {
    const contact = Collision.positionsAtContact(a, b);
    const ab = contact.b.clone().sub(contact.a).normalize(); // Normal vector
  
    // Tangential vector (perpendicular to ab in the x,y plane)
    const tangent = new Vector3(-ab.y, ab.x, 0);
  
    // Relative velocity
    const relativeVel = b.vel.clone().sub(a.vel);
  
    // Relative velocity at contact point due to spin
    const aSpinContribution = a.rvel.clone().cross(new Vector3(0, 0, RADIUS));
    const bSpinContribution = b.rvel.clone().cross(new Vector3(0, 0, RADIUS));
    const relativeSpinVel = bSpinContribution.clone().sub(aSpinContribution);
  
    // Total relative velocity at contact
    const v_rel = relativeVel.clone().add(relativeSpinVel);
  
    // Decompose relative velocity into normal and tangential components
    const v_rel_normal = ab.dot(v_rel);
    const v_rel_tangent = tangent.dot(v_rel);
  
    // Only proceed if balls are moving towards each other
    if (v_rel_normal > 0) return;
  
    // Calculate normal impulse (assuming perfectly elastic collision, restitution e = 1)
    const e = 1; // Coefficient of restitution
    const j_n = -(1 + e) * v_rel_normal / (2 / MASS);
  
    // Apply normal impulse to linear velocities
    const impulse_normal = ab.clone().multiplyScalar(j_n);
    a.vel.sub(impulse_normal.clone().divideScalar(MASS));
    b.vel.add(impulse_normal.clone().divideScalar(MASS));
  
    // Calculate friction impulse
    // Relative tangential velocity before impulse
    let j_t = -v_rel_tangent / (2 / MASS + (RADIUS * RADIUS) / INERTIA);
  
    // Clamp friction impulse to Coulomb's law
    const j_t_max = MU * j_n;
    if (Math.abs(j_t) > Math.abs(j_t_max)) {
      j_t = -j_t_max * Math.sign(v_rel_tangent);
    }
  
    // Apply friction impulse to linear velocities
    const impulse_tangent = tangent.clone().multiplyScalar(j_t);
    a.vel.sub(impulse_tangent.clone().divideScalar(MASS));
    b.vel.add(impulse_tangent.clone().divideScalar(MASS));
  
    // Apply friction impulse to angular velocities
    a.rvel.sub(new Vector3(0, 0, j_t * RADIUS / INERTIA));
    b.rvel.add(new Vector3(0, 0, j_t * RADIUS / INERTIA));
  
    // **Optional:** Incorporate throw effects based on post-collision velocities
    // This can involve further calculations if you want to adjust positions or apply additional physics.
  }