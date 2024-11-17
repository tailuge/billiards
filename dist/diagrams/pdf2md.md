**1863**

> **A theoretical analysis of billiard ball dynamics under cushion
> impacts**
>
> **S Mathavan**∗**, M R Jackson,** and **R M Parkin**
>
>
> **Abstract:** The last two decades have seen a growing interest in
> research related to billiards. There have been a number of projects
> aimed at developing training systems, robots, and com-puter
> simulations for billiards. Determination of billiard ball trajectories
> is important for all of these systems. The ball's collision with a
> cushion is often encountered in billiards and it drasti-cally changes
> the ball trajectory, especially when the ball has spin. This work
> predicts ball bounce
> anglesandbouncespeedsfortheball'scollisionwithacushion,undertheassumptionofinsignifi-cant
> cushion deformation. Differential equations are derived for the ball
> dynamics during the impact and these equations are solved numerically.
> The numerical solutions together with pre-vious experimental work by
> the authors predict that for the ball--cushion collision, the values
> of the coefficient of restitution and the sliding coefficient of
> friction are 0.98 and 0.14, respectively. A comparison of the
> numerical and experimental results indicates that the limiting normal
> velo-city under which the rigid cushion assumption is valid is 2.5
> m/s. A number of plots that show the rebound characteristics for given
> ball velocity--spin conditions are also provided. The plots quantify
> various phenomena that have hitherto only been described in the
> billiards literature.
>
> **Keywords:** impulse with friction, billiards, snooker, pool, ball
> trajectories, cushion rebound, coefficient of restitution, impact
> simulations

+-----------------------+-----------------------+-----------------------+
| > **1**               | > **INTRODUCTION**    | systems for billiard  |
|                       |                       | games                 |
|                       |                       | \[**6**--**8**\]. The |
|                       |                       | research on com-      |
+=======================+=======================+=======================+
+-----------------------+-----------------------+-----------------------+

puterbilliards,whichsimulatesthereal-worldbilliards

> Snooker and pool are two popular cue sports generally known as
> billiards (here onwards the term 'billiards' is used to refer to both
> snooker and pool). Billiards is a classic example of dynamic concepts
> such as spin-ning, rolling, sliding, and the collisions of spheres.
> Billiards was one of the first games to be analysed from a technical
> perspective. The 1835 study by the French scientist Coriolis, entitled
> *Théorie mathématique des effets du jeu de billard*, is a pioneering
> work on sports dynamics \[**1**\]. Billiards-related research is
> steadily on the rise and in recent years a number of robots have been
> developed to play pool and snooker \[**2**--**5**\]. There are also a
> number of initiatives for creating training
>
> environment, also receives the increasing attention of computer
> scientists seeking to create artificial intel-ligence that can
> formulate appropriate game-playing strategies \[**9**--**11**\].
>
> Billiards is about manipulating the balls accurately on the table
> along different trajectories. This is per-formed so that all object
> balls are potted, in the given order, and the cue ball is left at an
> advanta-geous position on the table, after each shot, to play the next
> shot successfully. A player often uses cush-ion (or wall/rail/bumper)
> impacts to achieve planned trajectories. Cushion impacts give a great
> deal of vari-ation to the game. The ball--cushion impacts change the
> ball trajectories dramatically when combined with the effects of ball
> spin and give the player a greater

+---------+---------+---------+---------+---------+---------+---------+
| ∗*      | *a      | *Depa   | *of*    | *Mech   | > *and* | > flex  |
| Corresp | uthor:* | rtment* |         | anical* |         | ibility |
| onding* |         |         |         |         |         | > in    |
|         |         |         |         |         |         | > his   |
|         |         |         |         |         |         | > game  |
|         |         |         |         |         |         | > s     |
|         |         |         |         |         |         | trategy |
|         |         |         |         |         |         | > (see  |
|         |         |         |         |         |         | > Fig.  |
|         |         |         |         |         |         | > 1).   |
+=========+=========+=========+=========+=========+=========+=========+
+---------+---------+---------+---------+---------+---------+---------+

> *Manufacturing Engineering, Loughborough University, Holy-well
> Mechatronics Research Centre, Holywell Way, Loughborough,
> Leicestershire, LE11 3UZ, UK.*
>
> *email: S.Mathavan@lboro.ac.uk*
>
> Previously, bounces of the ball off the cushion have been analysed by
> incorporating the coefficient of resti-tution between the ball and the
> cushion as the only influencing parameter and by considering the ball

+-----------------------------------+-----------------------------------+
| > **JMES1964**                    | **Proc. IMechE Vol. 224 Part C:   |
|                                   | J. Mechanical Engineering         |
|                                   | Science**                         |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

+-----------------------------------+-----------------------------------+
| > **1864**                        | > **S Mathavan, M R Jackson, and  |
|                                   | > R M Parkin**                    |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

> ![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image1.png){width="3.249998906386702in"
> height="1.7680555555555555in"}
>
> during the time of the impact as constant, do not seem correct (it is
> shown later that this keeps chang-ing, throughout impact). Most
> importantly, Marlow's analysis is not complete.
>
> This article presents a 3D analysis of the cushion--ball impact. For
> given input conditions (see Fig. 2), the analysis enables the
> calculation of the rebound conditions. This work will be useful for
> research on robotic billiards that involves trajectory calculations
> for the ball motion. Ball trajectory estimation is also necessary for
> the systems that are used to train ama-

+-----------------------+-----------------------+-----------------------+
| > **Fig. 1**          | > Positioning the cue | > teur billiard       |
|                       | > ball by its bounce  | > players, as they    |
|                       | > off the cush-       | > need to instruct    |
|                       |                       | > the player          |
+=======================+=======================+=======================+
|                       |                       | > how a given shot    |
|                       |                       | > (with a given       |
|                       |                       | > velocity and spin)  |
|                       |                       | > will                |
+-----------------------+-----------------------+-----------------------+
|                       | > ion, by imparting   |                       |
|                       | > different ball      |                       |
|                       | > spins to it while   |                       |
+-----------------------+-----------------------+-----------------------+
|                       |                       | > change the          |
|                       |                       | > configuration of    |
|                       |                       | > the balls on the    |
|                       |                       | > table. In           |
+-----------------------+-----------------------+-----------------------+
|                       | > still potting the   |                       |
|                       | > object ball (shown  |                       |
|                       | > in black)           |                       |
+-----------------------+-----------------------+-----------------------+
|                       |                       | > addition, a         |
|                       |                       | > computer simulation |
|                       |                       | > of billiards        |
|                       |                       | > incorpo-            |
+-----------------------+-----------------------+-----------------------+

rating the knowledge from this 3D impact analysis

![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image2.png){width="1.3361100174978127in"
height="2.75in"}

> **Fig. 2** Billiard ball prior to collision with a cushion
>
> velocity normal to the cushion as the sole variable. According to
> current theory, and referring to Fig. 2, once the ball bounces off the
> cushion, it will have a velocity of *eeV*0 sin *α* normal to the
> cushion, and a velocity *V*0 cos *α* along the cushion respectively,
> where *ee* is the coefficient of restitution between the ball and
> thecushion.Thissimpleanalysisdoesnotconsiderthe effects of ball spin
> and the effect of friction during the impact, since it treats the
> collision as a purely two-dimensional (2D) phenomenon (the plane of
> analysis is as given in Fig. 2).
>
> Ball spin, both sidespin *ω*S 0and topspin *ω*T 0, as shown in Fig. 2,
> are known to affect both the rebound speed and the rebound angle *β*
> of the ball. The latter two quantities are vital in order to estimate
> the trajectory of the ball after the cushion collision. Even though
> Marlow \[**12**\] tried to address these issues, the way the analysis
> was performed involved parameters like the impact time between the
> cushion and the ball for
>
> would give the user a more realistic experience of the game.
> Furthermore, this work will also be of interest to the researchers
> working on the physics of billiards (for an exhaustive list of
> publications on billiard physics, see Alciatore \[**13**\]).
>
> **2 THEORY**
>
> The billiards cushion is made of pure gum rubber that has very good
> rebound properties. The cross-section of a typical billiard cushion is
> shown in Fig. 3. A slope is usually provided in the cushion such that
> its contact point on the ball is always above the horizontal great
> circle of the ball, in order to prevent the ball from leap-ing up in
> the air after impact. The following analysis assumes that the cushion
> does not change its geom-etry during the impact with the ball. This
> assumption may not be valid at high ball speeds, as the normal ball
> velocity at I (see Fig. 3), along the negative *Z*′-axis, will try to
> lift up the tip of the cushion. Also, the ball and the cushion are
> assumed to have a point contact, which again may not be true at larger
> ball speeds, as theballwillstartto'sink'moreintotherubbercushion.
>
> ![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image3.png){width="2.668054461942257in"
> height="1.9638877952755907in"}

+-----------------------+-----------------------+-----------------------+
| > which the values    | **Fig. 3**            | > Forces acting on    |
| > were unknown. In    |                       | > the ball at the     |
| > addition, other     |                       | > moment of col-      |
+=======================+=======================+=======================+
| > assumptions made by |                       | > lision: a side view |
| > Marlow, such as     |                       | > along the cushion   |
| > taking the          |                       | > at table            |
+-----------------------+-----------------------+-----------------------+
| > direction of        |                       | > level               |
| > sliding between the |                       |                       |
| > ball and the        |                       |                       |
| > cushion             |                       |                       |
+-----------------------+-----------------------+-----------------------+
| > **Proc. IMechE Vol. |                       | **JMES1964**          |
| > 224 Part C: J.      |                       |                       |
| > Mechanical          |                       |                       |
| > Engineering         |                       |                       |
| > Science**           |                       |                       |
+-----------------------+-----------------------+-----------------------+

  -----------------------------------------------------------------------
  **A theoretical analysis of         **1865**
  billiard ball dynamics under        
  cushion impacts**                   
  ----------------------------------- -----------------------------------

  -----------------------------------------------------------------------

> ![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image4.png){width="2.8361111111111112in"
> height="1.823611111111111in"}
>
> **Fig. 4** Forces on the ball during impact (a part of the cushion is
> shown)
>
> According to Fig. 3, the height of the contact point at the rail (i.e.
> I) is *h*. In both snooker and pool *h* = 7*R*/5, where *R* is the
> ball radius.The common normal line *Z*′,
>
> in equation (3c). According to de la Torre Juárez \[**14**\], in the
> limit*t* →0, the non-diverging forces, such as the weight *mg*, will
> have a negligible contribution and thus will not influence the
> increase in momentum. It should also be noted that the slope shape of
> the cush-ion constrains the vertical motion of the ball. Hence, in
> equation (3c),˙*z*G = 0. Equation (3c) is rearranged as
>
> *P*C =*P*I sin *θ* −*P*I *y*′ cos *θ* (3d)
>
> Similarly, for the rotational motion of the ball about the *X*-axis,
> the following equation can be derived, with angular velocity being
> denoted by˙
>
> *(P*I *y*′ +*P*C *y)R* = *I*˙*θx*
>
> Where the moment of inertia of the ball *I* = 2*MR*2*/*5, the above
> equation can be written as

+-------------+-------------+-------------+-------------+-------------+
| > at the    |             | *P*I *y*′   | > *θx*˙     | (4a)        |
| > contact   |             | +*P*C *y*=  |             |             |
| > point     |             | 2*MR*       |             |             |
| > with the  |             |             |             |             |
| > cushion,  |             |             |             |             |
| > makes an  |             |             |             |             |
| > angle     |             |             |             |             |
+=============+=============+=============+=============+=============+
| > of *θ*    |             |             |             |             |
| > with the  |             |             |             |             |
| > *Y*       |             |             |             |             |
| > -axis,    |             |             |             |             |
| > thus, sin |             |             |             |             |
| > *θ* =     |             |             |             |             |
| > 2/5.      |             |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
|             |             | >           |             |             |
|             |             |  Similarly, |             |             |
|             |             | > about the |             |             |
|             |             | > *Y* -axis |             |             |
|             |             | > and the   |             |             |
|             |             | > *Z*-axis  |             |             |
+-------------+-------------+-------------+-------------+-------------+
| **2.1**     | > **General |             |             |             |
|             | > equations |             |             |             |
|             | > of        |             |             |             |
|             | > motion**  |             |             |             |
+-------------+-------------+-------------+-------------+-------------+

> Referring to Fig. 4, for the linear motion of the ball along the *X*-,
> *Y* -, and *Z*-directions, the following can be written

+-----------------------------------+-----------------------------------+
| > *F*I *x*+ *F* C *x*= *M* ¨*x*G  | > (1a)\                           |
| >                                 | > (1b)\                           |
| > −*F*I cos *θ* −*F*I *y*′ sin    | > (1c)                            |
| > *θ* + *F* C *y*= *M* ¨*y*G      |                                   |
| >                                 |                                   |
| > −*F*I sin *θ* + *F*I *y*′ cos   |                                   |
| > *θ* + *F*C −*Mg* = *M* ¨*z*G    |                                   |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

Within the duration of the collision of the ball with the cushion, at
any time instant *t* = *τ*, consider an infinitesimally small time
period *τ*. Now, let*P* denote the impulse or change in momentum due to
the action of a general force *F* over *τ*. Also, the accu-mulated total
impact up to time *T* is denoted as *P* (and assuming that the impact
started at *t* = 0); hence, it can be written that

> *τ*+*τ*\
> *P* = *τ* *F* d*t* (2a)
>
> and

T

+-------------+-------------+-------------+-------------+-------------+
| > *P* =     | *P* =       | 0           | > *F* d*t*  | (2b)        |
+=============+=============+=============+=============+=============+
+-------------+-------------+-------------+-------------+-------------+

> The impulse--momentum relationship in conjunction
>
> *P*I *x*sin *θ* −*P*C *x*= 2*MR* *θy*˙ (4b)
>
> −*P*I *x*cos *θ* = 2*MRθz*˙ (4c)
>
> **2.2** **Impact dynamics at I and C**
>
> At the contact point of the ball and the cushion, I, the ball will
> generally slip on the cushion (rolling can be treated as a special
> case of slipping, where the slip-ping velocity is zero). The slip will
> take place on the *XY*′plane (i.e. the tangential plane); also noting
> that the axis *Y*′is in the *YZ* plane. Let the slip speed of the ball
> at I be *s(t)* at an angle *(t)* with the *X*-axis. The instantaneous
> value of the normal impulse *P*I accord-ing to equation (2b) will
> always be positive, since *F*I is always positive. In addition, *P*I
> monotonously increases with time *t* within the interval of impact.
> Therefore, *P*I is considered as the independent vari-able for the
> analysis of impact instead of the regularly used variable of time *t*
> \[**15**\]. See Stronge \[**15**\] for an elaborative explanation of
> the other principles used within subsection 2.2.
>
> Referring to Fig. 5, the slipping velocities along the *X*-axis and
> the *Y*′-axis are given by, respectively

+-----------------+-----------------+-----------------+-----------------+
| > with equation |                 | > *x*I =        | (5a)            |
| > (2a), along   |                 | > *s(P*I*)*     |                 |
| > the above     |                 | > c             |                 |
| > directions    |                 | os\[*(P*I*)*\]\ |                 |
| > results       |                 | > *y*′˙I=       |                 |
|                 |                 | > *s(P*I*)*     |                 |
|                 |                 | >               |                 |
|                 |                 | sin\[*(P*I*)*\] |                 |
+=================+=================+=================+=================+
| > in the        |                 |                 |                 |
| > following     |                 |                 |                 |
| > equations     |                 |                 |                 |
+-----------------+-----------------+-----------------+-----------------+
|                 |                 |                 | (5b)            |
+-----------------+-----------------+-----------------+-----------------+
| > *P*I *x*+*P*C | > (3a)\         |                 |                 |
| > *x*= *M*˙*x*G | > (3b)          |                 |                 |
| >               |                 |                 |                 |
| > −*P*I cos *θ* |                 |                 |                 |
| > −*P*I *y*′    |                 |                 |                 |
| > sin *θ* +*P*C |                 |                 |                 |
| > *y*= *M*˙*y*G |                 |                 |                 |
+-----------------+-----------------+-----------------+-----------------+
|                 |                 | > However,      | \(6\)           |
|                 |                 | > ˙*y*′Ican     |                 |
|                 |                 | > also be       |                 |
|                 |                 | > written as    |                 |
+-----------------+-----------------+-----------------+-----------------+
|                 |                 | > *y*′˙I=       |                 |
|                 |                 | > −˙*y*I sin    |                 |
|                 |                 | > *θ* + ˙*z*I   |                 |
|                 |                 | > cos *θ*       |                 |
+-----------------+-----------------+-----------------+-----------------+
| > −*P*I sin *θ* | (3c)            |                 |                 |
| > +*P*I *y*′    |                 |                 |                 |
| > cos *θ* +*P*C |                 |                 |                 |
| > = *M*˙*z*G    |                 |                 |                 |
+-----------------+-----------------+-----------------+-----------------+

> It should be noted that the impact component due to the force of
> gravity acting on the ball, *mg*, is absent
>
> Using the Amontons--Coulomb law of friction, for *s \>* 0, also noting
> that the friction forces/impulses

+-----------------------------------+-----------------------------------+
| > **JMES1964**                    | **Proc. IMechE Vol. 224 Part C:   |
|                                   | J. Mechanical Engineering         |
|                                   | Science**                         |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

+-----------------------------------+-----------------------------------+
| > **1866**                        | > **S Mathavan, M R Jackson, and  |
|                                   | > R M Parkin**                    |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image5.png){width="2.999998906386702in"
height="2.3194444444444446in"}

> where *μ*s is the coefficient of friction between the ball and the
> table surface.
>
> **2.3** **Velocity relationships**
>
> The velocity of any point on the ball surface can be
>
> expressed in vector notation as
>
> ***V*** = ***V*** G + *ω **XR***
>
> where ***V*** is the vector that represents the linear veloc-
>
> ity of a point on the ball surface, vector ***V*** G stands for the
> linear centroidal velocity of the ball, ***ω*** is the vec-
>
> tor denoting the rotational speed of the ball about its

+-----------------------+-----------------------+-----------------------+
| **Fig. 5**            | > Slip velocities at  | > centroid, ***R***   |
|                       | > I and C             | > is the vector       |
|                       |                       | > defining the        |
|                       |                       | > spatial location    |
+=======================+=======================+=======================+
|                       |                       | > of such a surface   |
|                       |                       | > point in relation   |
|                       |                       | > to the ball centre, |
+-----------------------+-----------------------+-----------------------+

> are opposite to the direction of sliding, the friction impulses along
> *X* and *Y*′are
>
> and ***X*** denotes the vector product, also known as the cross
> product.
>
> Hence

+-----------------+-----------------+-----------------+-----------------+
| > *P*I *x*=     | (7a)            | > ***V***       | \(11\)          |
| > −*μ*w         |                 | > =***V*** G    |                 |
| > cos\          |                 | > +***ω XR***   |                 |
| [*(P*I*)*\]*P*I |                 |                 |                 |
| >               |                 |                 |                 |
| > *P*I *y*′ =   |                 |                 |                 |
| > −*μ*w         |                 |                 |                 |
| > sin\          |                 |                 |                 |
| [*(P*I*)*\]*P*I |                 |                 |                 |
+=================+=================+=================+=================+
|                 | (7b)            |                 |                 |
+-----------------+-----------------+-----------------+-----------------+

> where *μ*w is the coefficient of friction between the ball and the
> cushion.

From equations (3a) and (7b), the normal reaction

> From equation (11), resolving components along the axes appropriately,
> slip velocities along any axis can be expressed in terms of the
> centroid velocities of

+-----------------+-----------------+-----------------+-----------------+
| > from the      |                 | > the ball.\    |                 |
| > table surface |                 | > At I          |                 |
| > to the ball   |                 |                 |                 |
| > is given by   |                 |                 |                 |
+=================+=================+=================+=================+
| *P*C = {sin     | \(8\)           |                 |                 |
| *θ* + *μ*w      |                 |                 |                 |
| sin\[*(P*I*)*\] |                 |                 |                 |
| cos *θ*}*P*I    |                 |                 |                 |
+-----------------+-----------------+-----------------+-----------------+
|                 |                 | > *x*I =˙*x*G   | > (12a) (12b)   |
|                 |                 | > +˙*θyR* sin   |                 |
|                 |                 | > *θ* −˙*θzR*   |                 |
|                 |                 | > cos *θ*       |                 |
|                 |                 | >               |                 |
|                 |                 | > *y*′˙I=       |                 |
|                 |                 | > −˙*y*G sin    |                 |
|                 |                 | > *θ* +˙*z*G    |                 |
|                 |                 | > cos *θ*       |                 |
|                 |                 | > +˙*θxR*       |                 |
+-----------------+-----------------+-----------------+-----------------+
| > Using the     |                 |                 |                 |
| > earlier       |                 |                 |                 |
| > argument, for |                 |                 |                 |
| > the impact at |                 |                 |                 |
| > C, the        |                 |                 |                 |
| > instantaneous |                 |                 |                 |
| > impulse value |                 |                 |                 |
| > *P*C should   |                 |                 |                 |
| > be chosen as  |                 |                 |                 |
| > the           |                 |                 |                 |
| > independent   |                 |                 |                 |
| > variable.     |                 |                 |                 |
| > However,      |                 |                 |                 |
| > equation (8)  |                 |                 |                 |
| > shows that    |                 |                 |                 |
| > the value of  |                 |                 |                 |
| > *P*C directly |                 |                 |                 |
| > depends on    |                 |                 |                 |
| > the value of  |                 |                 |                 |
| > *P*I. Hence,  |                 |                 |                 |
| > also for the  |                 |                 |                 |
| > impact at C,  |                 |                 |                 |
| > *P*I is       |                 |                 |                 |
| > con-sidered   |                 |                 |                 |
| > as the        |                 |                 |                 |
| > independent   |                 |                 |                 |
| > variable.     |                 |                 |                 |
| > This makes it |                 |                 |                 |
| > possible to   |                 |                 |                 |
| > have *P*I as  |                 |                 |                 |
| > the           |                 |                 |                 |
| > independent   |                 |                 |                 |
| > variable for  |                 |                 |                 |
| > all the       |                 |                 |                 |
| > impulse       |                 |                 |                 |
| > forces acting |                 |                 |                 |
| > on the ball.  |                 |                 |                 |
| >               |                 |                 |                 |
| > For the       |                 |                 |                 |
| > impact at C,  |                 |                 |                 |
| > the slip      |                 |                 |                 |
| > takes place   |                 |                 |                 |
| > within the    |                 |                 |                 |
| > *XY* plane.   |                 |                 |                 |
| > Let *s*′be    |                 |                 |                 |
| > the slip      |                 |                 |                 |
| > speed and′be  |                 |                 |                 |
| > the direction |                 |                 |                 |
| > of slip       |                 |                 |                 |
| > measured from |                 |                 |                 |
| > the *X*-axis. |                 |                 |                 |
| > Now, the      |                 |                 |                 |
| > components of |                 |                 |                 |
| > *s*′along the |                 |                 |                 |
| > *X*- and *Y*  |                 |                 |                 |
| > -directions   |                 |                 |                 |
| > are           |                 |                 |                 |
+-----------------+-----------------+-----------------+-----------------+
|                 |                 | > Similarly at  |                 |
|                 |                 | > C, along the  |                 |
|                 |                 | > *X*-axis      |                 |
+-----------------+-----------------+-----------------+-----------------+
|                 |                 | > *x*C =˙*x*G   | (13a)           |
|                 |                 | > −˙*θyR*       |                 |
+-----------------+-----------------+-----------------+-----------------+
|                 |                 | > and along the |                 |
|                 |                 | > *Y* -axis     |                 |
+-----------------+-----------------+-----------------+-----------------+
|                 |                 | > *y*C =˙*y*G   | (13b)           |
|                 |                 | > +˙*θxR*       |                 |
+-----------------+-----------------+-----------------+-----------------+
| > *x*C =        | > (9a)\         | > Equations     |                 |
| > *s*′*(P*I*)*  | > (9b)          | > (12) and (13) |                 |
| > co            |                 | > make it       |                 |
| s\[′*(P*I*)*\]\ |                 | > possible to   |                 |
| > *y*C =        |                 | > estimate the  |                 |
| > *s*′*(P*I*)*  |                 | > slip          |                 |
| > s             |                 | > velocities    |                 |
| in\[′*(P*I*)*\] |                 | > and the slip  |                 |
|                 |                 | > angles of the |                 |
|                 |                 | > ball, both at |                 |
|                 |                 | > the table and |                 |
|                 |                 | > at the        |                 |
|                 |                 | > cushion       |                 |
|                 |                 | > interface.    |                 |
+-----------------+-----------------+-----------------+-----------------+

> Hereafter, the independent variable *P*I is omitted from all equations
> for the sake of simplicity. When *s*′*\>* 0, at
>
> C the impulse forces along the *X* and *Y* directions, also
>
> using equation (8), are

+-----------------------------------+-----------------------------------+
| > *P*C *x*= −*μ*s cos′*P*C        | (10a)                             |
| >                                 |                                   |
| > = −*μ*s cos′*(*sin *θ* + *μ*w   | (10b)                             |
| > sincos *θ)P*I                   |                                   |
| >                                 |                                   |
| > *P*C *y*= −*μ*s sin′*P*C        |                                   |
| >                                 |                                   |
| > = −*μ*s sin′*(*sin *θ* + *μ*w   |                                   |
| > sincos *θ)P*I                   |                                   |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

+-----------------------------------+-----------------------------------+
| **2.4**                           | > **A description of ball         |
|                                   | > dynamics**                      |
+===================================+===================================+
| > When substituting the           |                                   |
| > expressions for*P*I *x*and*P*C  |                                   |
| >                                 |                                   |
| > from equations (7a) and (10a)   |                                   |
| > in equation (3a),˙which is the  |                                   |
| > increment in the centroid       |                                   |
| > velocity in the *x*G,           |                                   |
| >                                 |                                   |
| > *X* direction ˙and′by *x*G, is  |                                   |
| > expressed in terms of the slip  |                                   |
| > angles                          |                                   |
| >                                 |                                   |
| > *x*G = −1 *M*\[*μ*w cos+ *μ*s   |                                   |
| > cos′                            |                                   |
+-----------------------------------+-----------------------------------+

> × *(*sin *θ* + *μ*w sincos *θ)*\]*P*I

+-----------------------------------+-----------------------------------+
| > **Proc. IMechE Vol. 224 Part C: | **JMES1964**                      |
| > J. Mechanical Engineering       |                                   |
| > Science**                       |                                   |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

  -----------------------------------------------------------------------
  **A theoretical analysis of         **1867**
  billiard ball dynamics under        
  cushion impacts**                   
  ----------------------------------- -----------------------------------

  -----------------------------------------------------------------------

> As*P*I →0 this equation will become
>
> the initial slip speeds at I and C are

<table>
<colgroup>
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="2"><p>d˙<em>x</em>G</p>
<p>d<em>P</em>I</p></th>
<th colspan="3"><blockquote>
<p>= −1 <em>M</em>[<em>μ</em>w cos+ <em>μ</em>s cos′</p>
</blockquote></th>
<th rowspan="5">(14a)</th>
<th colspan="2" rowspan="2"><em>s(</em>0<em>)</em> =</th>
<th colspan="4" rowspan="2"><blockquote>
<p>[<em>V</em>0 cos <em>α</em> + <em>R(ω</em>T 0cos <em>α</em> sin
<em>θ</em> −<em>ω</em>S 0cos <em>θ)</em>]2</p>
<p>+ [−<em>V</em>0 sin <em>α</em> sin <em>θ</em> −<em>Rω</em>T 0sin
<em>α</em>]2</p>
</blockquote></th>
</tr>
<tr class="odd">
<th colspan="5" rowspan="2"><blockquote>
<p>× <em>(</em>sin <em>θ</em> + <em>μ</em>w sincos <em>θ)</em>]</p>
</blockquote></th>
</tr>
<tr class="header">
<th colspan="6"><blockquote>
<p><em>s</em>′<em>(</em>0<em>)</em> = |<em>V</em>0 −<em>Rω</em>T 0|</p>
</blockquote></th>
</tr>
<tr class="odd">
<th colspan="5"><blockquote>
<p>Similarly, it could be shown that</p>
</blockquote></th>
<th colspan="6"><blockquote>
<p>and the slip angles are</p>
</blockquote></th>
</tr>
<tr class="header">
<th rowspan="2"><p>d˙<em>y</em>G</p>
<p>d<em>P</em>I</p></th>
<th colspan="4" rowspan="2"><blockquote>
<p>= −1 <em>M</em>[cos <em>θ</em> −<em>μ</em>w sin <em>θ</em> sin</p>
</blockquote></th>
<th colspan="3" rowspan="3"><em>(</em>0<em>)</em> = tan−1</th>
<th colspan="3" rowspan="3"><p>−<em>V</em>0 sin <em>α</em> sin
<em>θ</em> −<em>Rω</em>T 0sin <em>α</em></p>
<p><em>V</em>0 cos <em>α</em> + <em>R(ω</em>T 0cos <em>α</em> sin
<em>θ</em> −<em>ω</em>S 0cos <em>θ)</em></p></th>
</tr>
<tr class="odd">
<th rowspan="3">(14b)</th>
</tr>
<tr class="header">
<th rowspan="3"><p>d˙<em>z</em>G</p>
<p>d<em>P</em>I</p></th>
<th colspan="4" rowspan="3"><blockquote>
<p>+ <em>μ</em>s sin′<em>(</em>sin <em>θ</em> + <em>μ</em>w sincos
<em>θ)</em>] = 0</p>
</blockquote></th>
</tr>
<tr class="odd">
<th colspan="2" rowspan="2">′<em>(</em>0<em>)</em> =</th>
<th colspan="2"><blockquote>
<p><em>α</em></p>
</blockquote></th>
<th>for</th>
<th rowspan="2"><blockquote>
<p><em>V</em>0 −<em>Rω</em>T 0<em>&gt;</em> 0</p>
<p><em>V</em>0 −<em>Rω</em>T 0<em>&lt;</em> 0</p>
</blockquote></th>
</tr>
<tr class="header">
<th rowspan="2">(14c)</th>
<th colspan="2">180◦+ <em>α</em></th>
<th>for</th>
</tr>
<tr class="odd">
<th rowspan="2"><p>d˙<em>θx</em></p>
<p>d<em>P</em>I</p></th>
<th colspan="3" rowspan="2">= −</th>
<th rowspan="2"><blockquote>
<p>5<br />
2<em>MR</em>[<em>μ</em>w sin+ <em>μ</em>s sin′</p>
</blockquote></th>
<th colspan="6"><blockquote>
<p>where <em>α</em> is the incident angle of the ball.</p>
</blockquote></th>
</tr>
<tr class="header">
<th rowspan="3">(14d)</th>
<th colspan="6" rowspan="2"><blockquote>
<p>as the ball rolls on the table under this
condition.′<em>(</em>0<em>)</em> is not defined for the condition
<em>V</em>0 −<em>Rω</em>T 0= 0,</p>
</blockquote></th>
</tr>
<tr class="odd">
<th rowspan="3"><p>d˙<em>θy</em></p>
<p>d<em>P</em>I</p></th>
<th colspan="4"><blockquote>
<p>× <em>(</em>sin <em>θ</em> + <em>μ</em>w sincos <em>θ)</em>]</p>
</blockquote></th>
</tr>
<tr class="header">
<th colspan="3" rowspan="2">= −</th>
<th rowspan="2"><blockquote>
<p>5<br />
2<em>MR</em>[<em>μ</em>w cossin <em>θ</em> −<em>μ</em>s cos′</p>
</blockquote></th>
<th rowspan="2"><strong>3.2</strong></th>
<th colspan="5" rowspan="2"><strong>Friction coefficients and conditions
for rolling</strong></th>
</tr>
<tr class="odd">
<th rowspan="2">(14e)</th>
</tr>
<tr class="header">
<th rowspan="5"><p>d˙<em>θz</em></p>
<p>d<em>P</em>I</p></th>
<th colspan="2" rowspan="5">=</th>
<th colspan="2" rowspan="2"><blockquote>
<p>× <em>(</em>sin <em>θ</em> + <em>μ</em>w sincos <em>θ)</em>]</p>
</blockquote></th>
<th colspan="6"><blockquote>
<p>During the rolling phase slip speed <em>s</em> (or <em>s</em>′for the
slid-</p>
</blockquote></th>
</tr>
<tr class="odd">
<th rowspan="4">(14f)</th>
<th colspan="6" rowspan="2"><blockquote>
<p>ing on the table-felt) becomes zero. In this instance,</p>
</blockquote></th>
</tr>
<tr class="header">
<th colspan="2" rowspan="3"><blockquote>
<p>5<br />
2<em>MR(μ</em>w coscos <em>θ)</em></p>
</blockquote></th>
</tr>
<tr class="odd">
<th colspan="6"><blockquote>
<p>the relative motion between bodies stops at their</p>
</blockquote></th>
</tr>
<tr class="header">
<th colspan="6"><blockquote>
<p>contact point along the common tangent and the</p>
</blockquote></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

The differential equations in equation (14) describe the motion of the
ball completely. The slip angles and′can be replaced by the centroidal
veloc-ities {˙derived in section 2.3, resulting in six simultaneous
*x*G, ˙*y*G, ˙*z*G,˙*θx*,˙*θy*,˙*θz*}, by using the relationships

> first-order, second-degree, differential equations in {˙differential
> equations is extremely difficult to find. *x*G, ˙*y*G,
> ˙*z*G,˙*θx*,˙*θy*,˙*θz*}. An analytical solution for these
>
> However, a numerical solution is still possible, and the forms as
> given in equation (14) can be directly used in the numerical scheme.
>
> frictional forces become null (the effects of stick are
>
> neglected).
>
> 1\. For the condition *s* = 0, the ball will be rolling on
> thecushionatI.*P*I *x*=*P*I *y*′ = 0,andfromequation
>
> (3c),*P*C = 0. Hence
>
> *P*C *x*=*P*C *y*= 0 (15a)
>
> 2\. For the condition *s*′= 0, the ball will roll on the table
> surface, and

+-----------------+-----------------+-----------------+-----------------+
| **3**           | > **NUMERICAL   | *P*C *x*=*P*C   | (15b)           |
|                 | > SOLUTION**    | *y*= 0          |                 |
+=================+=================+=================+=================+
|                 |                 | > High-spe      |                 |
|                 |                 | ed-camera-based |                 |
|                 |                 | > measurements  |                 |
|                 |                 | > were used,    |                 |
+-----------------+-----------------+-----------------+-----------------+

> As seen already, the solution to the set of six differ-ential
> equations will involve a numerical method. The numerical algorithm has
> to be supplied with the initial conditions for the ball velocity, the
> conditions under which different motion transitions (such as sliding
> to rolling) take place, and numerical values for the parameters
> involved in the equations, such as *μs*.
>
> **3.1** **Initial conditions**
>
> Referring to Fig. 2, the initial conditions for the
>
> inapreviousworkbythepresentauthors,todetermine the sliding coefficient
> of friction between a snooker ball and the table-felt; the sliding
> coefficient of fric-tion *μ*s was found to be between 0.178 and 0.245
> \[**16**\]. Marlow \[**12**\] suggests a value of 0.2 for the game of
> pool. Since the present authors have performed exten-sive measurements
> of the various parameters related to snooker \[**16**\], from here
> onwards the numerical val-ues found in snooker are used for the
> calculations. *μ*s is assumed to be 0.212, as an average value. For a
> snooker ball, *M* = 0.1406 kg and *R* = 26.25 mm.

+-------------+-------------+-------------+-------------+-------------+
| > centroid  |             | > *         | **3.3**     | > **        |
| >           |             | (*˙*z*G*)*1 |             | Coefficient |
|  velocities |             | > = 0,      |             | > of        |
| > of the    |             | >           |             | >           |
| > ball are  |             | > and       |             | restitution |
|             |             |             |             | > and       |
|             |             |             |             | > impact**  |
+=============+=============+=============+=============+=============+
| *           | > *         |             | > **        |             |
| (*˙*x*G*)*1 | (*˙*y*G*)*1 |             | mechanics** |             |
| = *V*0 cos  | > = *V*0    |             |             |             |
| *α*,        | > sin *α*,  |             |             |             |
|             | >           |             |             |             |
| >           | >           |             |             |             |
|  *(*˙*θx)*1 |  *(*˙*θy)*1 |             |             |             |
| > = −*ω*T   | > = *ω*T    |             |             |             |
| > 0sin *α*, | > 0cos *α*, |             |             |             |
| >           |             |             |             |             |
| >           |             |             |             |             |
|  *(*˙*θz)*1 |             |             |             |             |
| > = *ω*S    |             |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
|             |             |             | > According |             |
|             |             |             | > to        |             |
|             |             |             | > Stronge   |             |
|             |             |             | >           |             |
|             |             |             | \[**15**\], |             |
|             |             |             | > the       |             |
|             |             |             | > energetic |             |
|             |             |             | >           |             |
|             |             |             | coefficient |             |
|             |             |             | > of        |             |
+-------------+-------------+-------------+-------------+-------------+
|             |             |             | > rest      |             |
|             |             |             | itution*e*e |             |
|             |             |             | > isi       |             |
|             |             |             | ndependento |             |
|             |             |             | ffrictionan |             |
|             |             |             | dtheprocess |             |
|             |             |             | > of slip.  |             |
|             |             |             | > *e*2 eis  |             |
|             |             |             | > the       |             |
|             |             |             | > negative  |             |
|             |             |             | > of the    |             |
|             |             |             | > ratio of  |             |
|             |             |             | > the work  |             |
|             |             |             | > done      |             |
+-------------+-------------+-------------+-------------+-------------+
| > *         |             |             | > **Proc.   |             |
| *JMES1964** |             |             | > IMechE    |             |
|             |             |             | > Vol. 224  |             |
|             |             |             | > Part C:   |             |
|             |             |             | > J.        |             |
|             |             |             | >           |             |
|             |             |             |  Mechanical |             |
|             |             |             | >           |             |
|             |             |             | Engineering |             |
|             |             |             | > Science** |             |
+-------------+-------------+-------------+-------------+-------------+

+-----------------+-----------------+-----------------+-----------------+
| > **1868**      | > **S Mathavan, |                 |                 |
|                 | > M R Jackson,  |                 |                 |
|                 | > and R M       |                 |                 |
|                 | > Parkin**      |                 |                 |
+=================+=================+=================+=================+
| > by the        |                 | **3.4**         | > **Numerical   |
| > impulse force |                 |                 | > algorithm**   |
| > during the    |                 |                 |                 |
| > restitution   |                 |                 |                 |
| > phase to      |                 |                 |                 |
+-----------------+-----------------+-----------------+-----------------+

> that during the compression phase. The work done at I by the forces
> acting along the axis *Z*′is
>
> Equations (14) have equivalent algebraic forms as

+---------+---------+---------+---------+---------+---------+---------+
| *WZ*′I= | >       | >       | > *P    | > *z*′  | (16a)   | *(*˙*x* |
|         | *τ*+*τ* | *F*I˙*z | *I+*P*I | ˙Id*P*I |         | G*)n*+1 |
|         |         | *′Id*t* | > *P*I  |         |         | −*(*˙*  |
|         |         | > =     |         |         |         | x*G*)n* |
|         |         |         |         |         |         | = −1    |
|         |         |         |         |         |         | *       |
|         |         |         |         |         |         | M*{*μ*w |
|         |         |         |         |         |         | cos     |
|         |         |         |         |         |         | *()n* + |
|         |         |         |         |         |         | *μ*s    |
|         |         |         |         |         |         | cos*    |
|         |         |         |         |         |         | (*′*)n* |
+=========+=========+=========+=========+=========+=========+=========+
|         | > *τ*   |         |         |         |         | × \[sin |
|         |         |         |         |         |         | *θ* +   |
|         |         |         |         |         |         | *μ*w    |
|         |         |         |         |         |         | s       |
|         |         |         |         |         |         | in*()n* |
|         |         |         |         |         |         | cos     |
|         |         |         |         |         |         | *θ*     |
|         |         |         |         |         |         | \]}*P*I |
|         |         |         |         |         |         | (17a)   |
+---------+---------+---------+---------+---------+---------+---------+
| > Its   |         |         | > \[*(* |         |         | >       |
| > nu    |         |         | ˙*z*′I* |         |         |  where, |
| merical |         |         | )n*+1 + |         |         | > using |
| > form  |         |         | > *(*˙2 |         |         | > e     |
| > is    |         |         | > *z*′  |         |         | quation |
|         |         |         | I*)n*\] |         |         | > sets  |
|         |         |         |         |         |         | > (12)  |
|         |         |         |         |         |         | > and   |
|         |         |         |         |         |         | > (13)  |
+---------+---------+---------+---------+---------+---------+---------+
|         |         |         |         |         |         | > t     |
|         |         |         |         |         |         | an*()n* |
|         |         |         |         |         |         | > =     |
|         |         |         |         |         |         | > −*(*˙ |
|         |         |         |         |         |         | *(*˙*x* |
|         |         |         |         |         |         | G*)n* + |
|         |         |         |         |         |         | > *(*˙* |
|         |         |         |         |         |         | y*G*)n* |
|         |         |         |         |         |         | > sin   |
|         |         |         |         |         |         | > *θ* + |
|         |         |         |         |         |         | > *(*˙  |
|         |         |         |         |         |         | >       |
|         |         |         |         |         |         | >       |
|         |         |         |         |         |         | *θy)nR* |
|         |         |         |         |         |         | > sin   |
|         |         |         |         |         |         | > *θ*   |
|         |         |         |         |         |         | >       |
|         |         |         |         |         |         |  −*(*˙\ |
|         |         |         |         |         |         | > *     |
|         |         |         |         |         |         | z*G*)n* |
|         |         |         |         |         |         | > cos   |
|         |         |         |         |         |         | > *θ* + |
|         |         |         |         |         |         | > *(*˙  |
|         |         |         |         |         |         | >       |
|         |         |         |         |         |         | >       |
|         |         |         |         |         |         | *θz)nR* |
|         |         |         |         |         |         | > cos   |
|         |         |         |         |         |         | > *θ*\  |
|         |         |         |         |         |         | >       |
|         |         |         |         |         |         | *θx)nR* |
+---------+---------+---------+---------+---------+---------+---------+
| >       |         |         |         |         |         |         |
|  *(WZ*′ |         |         |         |         |         |         |
| I*)n*+1 |         |         |         |         |         |         |
| > −*(WZ |         |         |         |         |         |         |
| *′I*)n* |         |         |         |         |         |         |
| > =*P*I |         |         |         |         |         |         |
+---------+---------+---------+---------+---------+---------+---------+

> where ˙the cushion in the direction of the common normal at I *z*′Iis
> the relative velocity between the ball and
>
> (here it is assumed that the cushion does not move suf-
>
> ficiently to affect a change in the relative velocity (i.e.
>
> the cushion is treated as a rigid body)). *F*I is the normal
>
> force from the cushion acting on the ball.When *P*f Iand
>
> *P*c Idenote the accumulated impulse at the termina-
>
> tion of impulse and at the termination of compression,
>
> respectively, it can be shown that \[**15**\]

+-----------------------+-----------------------+-----------------------+
| > *e*2 e=             | −                     | > *P*f                |
|                       |                       | >                     |
|                       |                       | > *P*c I˙*z*′Id*P*I   |
|                       |                       | >                     |
|                       |                       | > *P*c                |
|                       |                       | >                     |
|                       |                       | > 0˙*z*′Id*P*I        |
+=======================+=======================+=======================+
+-----------------------+-----------------------+-----------------------+

> Rearranging the equation
>
> and

+-----------------------------------------------------------------------+
| > tan*(*′*)n* =*(*˙*(*˙*x*G*)n* −*(*˙*y*G*)n* + *(*˙*θx)nR*           |
|                                                                       |
| *θy)nR*                                                               |
+=======================================================================+
+-----------------------------------------------------------------------+

> A numerical scheme is written in MATLAB®program-ming language. The
> values of *V*0, *ω*T 0, *ω*S 0, and *α* are the inputs to the scheme.
> The scheme calculates the changes in the values of *V*0, *ω*T 0, *ω*S
> 0, and *α* by increment-ing *P*I in small step sizes. The smaller the
> value of the incrementinimpulse*P*I (i.e.*P*I)inequation(15a),the more
> accurate the results. The aim is to find the cen-troid velocities of
> the balls at the final accumulated impulse value *P*f I.
>
> The numerical scheme, as shown in Fig. 6, starts by calculating the
> initial centroidal velocities and the cor-responding slip speeds and
> slip angles as illustrated

+-----------------------+-----------------------+-----------------------+
| > *WZ*′I*(P*f I*)* =  | (16b)                 | > in section 3.1. In  |
| > *(*1 −*e*2          |                       | > addition, arrays to |
| > e*)WZ*′I*(P*c I*)*  |                       | > store the inter-    |
+=======================+=======================+=======================+
|                       |                       | > mediate values of   |
|                       |                       | > the centroidal      |
|                       |                       | > velocities and slip |
+-----------------------+-----------------------+-----------------------+
|                       |                       | > speeds and slip     |
|                       |                       | > angles for each     |
|                       |                       | > increment in the    |
|                       |                       | > form                |
+-----------------------+-----------------------+-----------------------+

The termination of compression occurs when the nor-mal component of the
relative velocity becomes zero, that is

> of*P*I are also initiated. Then the algorithm continues its operation
> by calculating increments in the cen-troid velocities of the ball by
> using equation (17a) and five other simultaneous equations. Using
> these incre-

+-----------------------+-----------------------+-----------------------+
| > *z*′˙I*(P*c I*)* =  | (16c)                 | > ments and equations |
| > 0                   |                       | > (12a), (12b),       |
|                       |                       | > (13a), and (13b)    |
|                       |                       | > the                 |
+=======================+=======================+=======================+
|                       |                       | > new slip velocities |
|                       |                       | > are calculated.The  |
|                       |                       | > code is designed    |
+-----------------------+-----------------------+-----------------------+
|                       |                       | > to incorporate the  |
|                       |                       | > modifications       |
|                       |                       | > necessary when a    |
+-----------------------+-----------------------+-----------------------+

> According to Marlow \[**12**\], the coefficient of restitu-tion
> between the cushion and the ball, *e*e, is 0.55 for pool. However, the
> authors of this work have obtained an experimental plot for the
> ball--cushion impact in snooker, where a snooker ball, under the
> conditions of rolling (*ω*T 0= *V*0/*R)* and no sidespin (*ω*S 0= 0),
> was shot to collide with the cushion perpendicularly (*α* = 0), and
> tracked using a machine vision camera \[**15**\]. The incident versus
> rebound speed plot obtained was used to conclude that the equivalent
> coefficient of restitu-tion for a rolling ball perpendicularly
> colliding with the cushion has a value of 0.818, on average; the
> experimental procedure is briefly outlined in section 3.5. Here it
> must be noted that the value of 0.818 incorporates the effects of
> friction and the three-dimensionality of the impulse configuration,
> and only stands as a representative value for the coefficient of
>
> rolling condition is reached at either of the sliding contacts, as
> given in equations (15a) and (15b). The values of ball velocities are
> saved as arrays, including the work done at I along the *Z*′-axis
> (i.e. *WZ*′I, calculated from equation (16a)). The latest parameter
> values are appended to these arrays once each*P*I is applied.
>
> Icannot be found analytically and has to Again, *P*f\
> be obtained numerically using equations (16a) and (16b). The numerical
> scheme is initially stopped when *z*′and the corresponding value of
> work done is obtained˙I= 0 (i.e. when the compression phase has
> ended),
>
> from the array containing *WZ*′I, which will be *WZ*′I*(P*c I*)*. Now,
> using equation (16b), the value *WZ*′I*(P*f I*)* can be calculated,
> given that *e*e is known. The numerical pro-cess of incrementing *P*I
> can resume again, and when *WZ*′velocity values of the ball centroid
> are the last entries I= *WZ*′I*(P*f I*)*, the process is
> terminated.The rebound

+-----------------------------------+-----------------------------------+
| > restitution.                    | in the arrays of the respective   |
|                                   | velocity components.              |
+===================================+===================================+
| > **Proc. IMechE Vol. 224 Part C: | **JMES1964**                      |
| > J. Mechanical Engineering       |                                   |
| > Science**                       |                                   |
+-----------------------------------+-----------------------------------+

  -----------------------------------------------------------------------
  **A theoretical analysis of         **1869**
  billiard ball dynamics under        
  cushion impacts**                   
  ----------------------------------- -----------------------------------

  -----------------------------------------------------------------------

![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image6.png){width="5.336111111111111in"
height="7.256944444444445in"}

> **Fig. 6** Flowchart of the numerical algorithm
>
> Note: in order to start the numerical scheme, a reasonable value
> for*P*I has to be assumed. An approximate value for *P*f Ican be
> assumed to be *(*1 + *e*e*)MV*0 sin *α*, which is the value of the
> final accu-mulated normal impulse for a horizontally moving,
> non-spinning ball colliding into a solid vertical wall. Hence,
> approximately for *N* iterations,*PI* = \[*(*1 + *e*e*)MV*0 sin
> *α/N*\]. Obviously the values of *P*c will decide the actual number of
> iterations that have Iand *P*f
>
> taken place in the scheme. An initial *N* of 5000 worked
> satisfactorily for the scheme.
>
> **3.5** **Estimating *e*e and *μ*w**
>
> The experimental plot in Fig. 7 was obtained under the conditions of
> *ω*S a Riley®Renaissance-type snooker table, which is also 0= 0, *α* =
> 90◦, and *ω*T 0= *V*0*/R*, on
>
> the official table brand of the World Snooker Associa-tion and is used
> in all its professional tournaments. The ball speed is calculated from
> an experimental procedure involving a stationary high-speed camera
> (the general experimental procedure is explained in Mathavan *et al*.
> \[**16**\]). It is known that 0 *\< e*e ⩽1. For

+-----------------------------------+-----------------------------------+
| > **JMES1964**                    | **Proc. IMechE Vol. 224 Part C:   |
|                                   | J. Mechanical Engineering         |
|                                   | Science**                         |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

+-----------------------------------+-----------------------------------+
| > **1870**                        | > **S Mathavan, M R Jackson, and  |
|                                   | > R M Parkin**                    |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image7.png){width="5.0in"
height="2.408333333333333in"}

> **Fig. 7** Rebound speed versus incident velocity, obtained
> experimentally and numerically
>
> each of the experimentally obtained incident speed values (i.e. *V*0)
> in the speed range *V*0 *\<* 1.5 m/s, the numerical algorithm was run
> for values of *e*e and*μ*w between 0 and 1 in increments of 0.01, and
> the rebound speed ˙speeds were not considered, as the assumption of a
> *y*G*(P*f I*)* was obtained. Higher incident
>
> rigid cushion may not then be applicable. The values of *e*e and *μ*w
> that minimize the root mean square (RMS) value of the error between
> the experimental and the numerically predicted rebound speeds should
> be the actual value for the coefficient of restitution between
>
> speeddeviatefromtheexperimentallyobtainedvalues for speeds *V*0 *\>*
> 2.5 m/s. *V*0 *\>* 2.5 m/s is, quite possibly, the velocity limit
> under which the rigid body assump-tion for the cushion would be valid.
> *V*0 = 2.5 m/s is a considerably high ball speed as far as snooker is
> concerned. For oblique shots, only the ones for which the normal
> component of the incident velocity of less than 2.5 m/s would be
> analysed using the numerical algorithm described in section 3.4.

+-----------------------+-----------------------+-----------------------+
| > the cushion and the | **4**                 | > **RESULTS AND       |
| > ball. Calculations  |                       | > DISCUSSION**        |
| > showed that         |                       |                       |
+=======================+=======================+=======================+
+-----------------------+-----------------------+-----------------------+

> the RMS error was a minimum when *ee* = 0.98 and*μ*w = 0.14.
> Numerically obtained rebound speed values for
>
> *e*e = 0.98 and *μ*w = 0.14 are plotted in Fig. 7 together with the
> experimentally obtained values. As seen in
>
> Fig. 7(b), numerically obtained values of the incident
>
> The results obtained from the numerical algorithm for various
> speed--spin combinations are given in Figs 8 to 10.
>
> In billiards, once the ball is struck by the cue stick, the ball
> generally slides, where *ω*T 0̸= *V*0/*R*. However,

![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image8.png){width="5.0in"
height="2.8777777777777778in"}

+-----------------------+-----------------------+-----------------------+
| **Fig. 8**            | > Rebound speed and   |                       |
|                       | > rebound angle       |                       |
|                       | > versus incident     |                       |
|                       | > angle for different |                       |
|                       | > rolling velocities  |                       |
|                       | > with                |                       |
+=======================+=======================+=======================+
| > no sidespin (*ω*T   |                       |                       |
| > 0= *V*0/*R*, *ω*S   |                       |                       |
| > 0= 0)               |                       |                       |
+-----------------------+-----------------------+-----------------------+
| > **Proc. IMechE Vol. |                       | **JMES1964**          |
| > 224 Part C: J.      |                       |                       |
| > Mechanical          |                       |                       |
| > Engineering         |                       |                       |
| > Science**           |                       |                       |
+-----------------------+-----------------------+-----------------------+

  -----------------------------------------------------------------------
  **A theoretical analysis of         **1871**
  billiard ball dynamics under        
  cushion impacts**                   
  ----------------------------------- -----------------------------------

  -----------------------------------------------------------------------

![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image9.png){width="5.0in"
height="2.825in"}

+-----------------------------------+-----------------------------------+
| **Fig. 9**                        | > Rebound speed and rebound angle |
|                                   | > versus incident angle for       |
|                                   | > different topspins of the       |
|                                   | > ball,*ω*T 0= *kV*0/*R* and *V*0 |
|                                   | > = 1 m/s with no sidespin (*ω*S  |
|                                   | > 0= 0)                           |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image10.png){width="5.0in"
height="2.9125in"}

+-----------------------------------+-----------------------------------+
| **Fig. 10**                       | > Rebound speed and rebound angle |
|                                   | > versus incident angle for       |
|                                   | > different sidespins of the      |
|                                   | > ball,*ω*S 0= *kV*0/*R* and *V*0 |
|                                   | > = 1 m/s with the ball rolling   |
|                                   | > (*ω*T 0= *V*0/*R*)              |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

> the rolling condition of *ω*T by the action of friction between the
> ball and the table 0= *V*0/*R* is quickly achieved
>
> (an interested reader can refer to the camera-based tracking plots
> given in reference \[**16**\]). Hence, in most instances, the ball is
> likely to be in rolling mode when it collides with a cushion, also
> possibly with some sidespin. The plots for the simplest case of
> rolling with no sidespin are shown in Fig. 8. The plot of rebound
> speed versus incident angle for different incident ball speeds clearly
> shows the monotonous variation of the rebound speed with the incident
> speed. The sec-ond plot in Fig. 8 shows that the rebound angle plots
> are identical for different ball speeds. The plot sug-gests that the
> rebound angle is influenced only by the
>
> incident angle for a rolling ball with no sidespin prior to the
> impact.
>
> Figure 9 depicts the rebound conditions for a ball incident speed of 1
> m/s with different types of spin colliding with the cushion at
> different incident angles. According to Fig. 9, when the ball is
> overspinning before the collision, its rebound tends to be generally a
> 90◦incident angle, the rebound speed reaches the 0= 2*V*0/*R*, at
> higher. When the topspin of the ball is *ω*T
>
> incident speed value of *V*0. For any given speed--spin conditions,
> the speed loss is largest for the ball inci-dent angles around 40◦.
> The rebound angles are not greatly affected by the excessive topspin
> of the ball as seen in the second plot of Fig. 9.

+-----------------------------------+-----------------------------------+
| > **JMES1964**                    | **Proc. IMechE Vol. 224 Part C:   |
|                                   | J. Mechanical Engineering         |
|                                   | Science**                         |
+===================================+===================================+
+-----------------------------------+-----------------------------------+

+-----------------+-----------------+-----------------+-----------------+
| > **1872**      | > **S Mathavan, |                 |                 |
|                 | > M R Jackson,  |                 |                 |
|                 | > and R M       |                 |                 |
|                 | > Parkin**      |                 |                 |
+=================+=================+=================+=================+
| Figure 10 shows |                 | **5**           | >               |
| the rebound     |                 |                 | **CONCLUSIONS** |
| characteristics |                 |                 |                 |
| for a           |                 |                 |                 |
+-----------------+-----------------+-----------------+-----------------+

> rolling ball with different sidespin values. The plots
>
> provide some very interesting results. Also, when the ball has right
> spin (according to billiards terminology, the direction of *ω*S 0-- as
> marked in Fig. 2 -- is called right spin, the opposite of which is
> left spin), the rebound
>
> A 3D impact analysis for the collision of a spinning billiard ball
> with a cushion is presented. Differen-tial equations are derived for
> ball dynamics during the time of impact and then the solutions are
> found
>
> speed exceeds the value of the incident speed. In addi- numerically.
>
> tion, for higher values of left spin, at higher incident angles
> towards 90◦, the rebound velocity exceeds the value of the incident
> ball speed. The second plot in Fig. 10 suggest that when the ball has
> left spin (*k \<* 0), and for incident angle values close to 90◦, the
> ball bounces back to the side from which it approached the cushion
> (see Fig. 11).This effect of the ball rebounding to the same side has
> been described by Walker \[**17**\] for billiards, and by Cross
> \[**18**\] in a general context for the bounce of a ball. Cross
> \[**18**\] also provides the experimental results for the rebound
> characteristics
>
> Combining some of the authors' previous experi-mental results with the
> numerical solutions, the coef-ficient of restitution for the
> ball--cushion collision is determined as 0.98. In addition, the value
> for the sliding coefficient of friction is found to be 0.14.
>
> The rebound angles and speeds are given as plots against the incident
> angles and speeds for differ-ent velocities and spin conditions. Under
> excessive sidespin conditions, the rebound speeds are found to exceed
> the incident speeds and the ball is also found to bounce back on the
> side from which it approached
>
> of a tennis ball bouncing on a rough surface. the cushion.
>
> A plot of sliding speeds against the instantaneous impulse value is
> shown in Fig. 12. The change in slip directions as indicated by the
> plot suggests that the assumption of unidirectional slip cannot be
> true.

![](vertopal_4c511c1b23594a51a6b6615e42c1f754/media/image11.png){width="1.3361100174978127in"
height="1.3013877952755906in"}

> Although this analysis provides the quantification for many phenomena
> involved with cushion collisions that are described in the billiards
> literature, it is expected to be validated by tracking the spin of a
> bil-liard ball. A colour pattern drawn on a white cue ball may be used
> for this purpose.
>
