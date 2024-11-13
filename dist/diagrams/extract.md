A theoretical analysis of billiard ball
dynamics under cushion impacts
S Mathavan∗, M R Jackson, and R M Parkin
Mechatronics Research Group, Wolfson School of Mechanical and Manufacturing Engineering, LoughboroughUniversity, Loughborough, UK
The manuscript was received on 9 September 2009 and was accepted after revision for publication on 30 November 2009.
DOI: 10.1243/09544062JMES1964
Abstract: The last two decades have seen a growing interest in research related to billiards.
There have been a number of projects aimed at developing training systems, robots, and com-
puter simulations for billiards. Determination of billiard ball trajectories is important for all ofthese systems. The ball’s collision with a cushion is often encountered in billiards and it drasti-cally changes the ball trajectory, especially when the ball has spin. This work predicts ball bounceangles and bounce speeds for the ball’s collision with a cushion, under the assumption of insigniﬁ-cant cushion deformation. Differential equations are derived for the ball dynamics during theimpact and these equations are solved numerically. The numerical solutions together with pre-vious experimental work by the authors predict that for the ball–cushion collision, the values ofthe coefﬁcient of restitution and the sliding coefﬁcient of friction are 0.98 and 0.14, respectively.A comparison of the numerical and experimental results indicates that the limiting normal velo-city under which the rigid cushion assumption is valid is 2.5 m/s. A number of plots that showthe rebound characteristics for given ball velocity–spin conditions are also provided. The plotsquantify various phenomena that have hitherto only been described in the billiards literature.
Keywords: impulse with friction, billiards, snooker, pool, ball trajectories, cushion rebound,
coefﬁcient of restitution, impact simulations
1 INTRODUCTION
Snooker and pool are two popular cue sports generally
known as billiards (here onwards the term ‘billiards’ isused to refer to both snooker and pool). Billiards isa classic example of dynamic concepts such as spin-ning, rolling, sliding, and the collisions of spheres.Billiards was one of the ﬁrst games to be analysed froma technical perspective. The 1835 study by the Frenchscientist Coriolis, entitled Théorie mathématique des
effets du jeu de billard , is a pioneering work on sports
dynamics [ 1]. Billiards-related research is steadily on
the rise and in recent years a number of robots havebeen developed to play pool and snooker [ 2–5]. There
are also a number of initiatives for creating training
∗Corresponding author: Department of Mechanical and
Manufacturing Engineering, Loughborough University, Holy-well Mechatronics Research Centre, Holywell Way, Loughborough,Leicestershire, LE11 3UZ, UK.email: S.Mathavan@lboro.ac.uksystems for billiard games [ 6–8]. The research on com-
puter billiards, which simulates the real-world billiardsenvironment, also receives the increasing attention ofcomputer scientists seeking to create artiﬁcial intel-ligence that can formulate appropriate game-playingstrategies [ 9–11].
Billiards is about manipulating the balls accurately
on the table along different trajectories. This is per-formed so that all object balls are potted, in thegiven order, and the cue ball is left at an advanta-geous position on the table, after each shot, to playthe next shot successfully. A player often uses cush-ion (or wall/rail/bumper) impacts to achieve plannedtrajectories. Cushion impacts give a great deal of vari-ation to the game. The ball–cushion impacts changethe ball trajectories dramatically when combined withthe effects of ball spin and give the player a greaterﬂexibility in his game strategy (see Fig. 1).
Previously, bounces of the ball off the cushion have
been analysed by incorporating the coefﬁcient of resti-tution between the ball and the cushion as the onlyinﬂuencing parameter and by considering the ball
JMES1964 Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science


1864 S Mathavan, M R Jackson, and R M Parkin
Fig. 1 Positioning the cue ball by its bounce off the cush-
ion, by imparting different ball spins to it whilestill potting the object ball (shown in black)
Fig. 2 Billiard ball prior to collision with a cushion
velocity normal to the cushion as the sole variable.
According to current theory, and referring to Fig. 2,once the ball bounces off the cushion, it will havea velocity of e
eV0sinαnormal to the cushion, and a
velocity V0cosαalong the cushion respectively, where
eeis the coefﬁcient of restitution between the ball and
the cushion. This simple analysis does not consider theeffects of ball spin and the effect of friction during theimpact, since it treats the collision as a purely two-dimensional (2D) phenomenon (the plane of analysisis as given in Fig. 2).
Ball spin, both sidespin ω
S
0and topspin ωT
0, as shown
in Fig. 2, are known to affect both the rebound speedand the rebound angle βof the ball. The latter two
quantities are vital in order to estimate the trajectoryof the ball after the cushion collision. Even thoughMarlow [ 12] tried to address these issues, the way
the analysis was performed involved parameters likethe impact time between the cushion and the ball forwhich the values were unknown. In addition, otherassumptions made by Marlow, such as taking thedirection of sliding between the ball and the cushionduring the time of the impact as constant, do not
seem correct (it is shown later that this keeps chang-ing, throughout impact). Most importantly, Marlow’sanalysis is not complete.
This article presents a 3D analysis of the cushion–
ball impact. For given input conditions (see Fig. 2),the analysis enables the calculation of the reboundconditions. This work will be useful for research onrobotic billiards that involves trajectory calculationsfor the ball motion. Ball trajectory estimation is alsonecessary for the systems that are used to train ama-teur billiard players, as they need to instruct the playerhow a given shot (with a given velocity and spin) willchange the conﬁguration of the balls on the table. Inaddition, a computer simulation of billiards incorpo-rating the knowledge from this 3D impact analysiswould give the user a more realistic experience of thegame. Furthermore, this work will also be of interest tothe researchers working on the physics of billiards (foran exhaustive list of publications on billiard physics,see Alciatore [ 13]).
2 THEORY
The billiards cushion is made of pure gum rubber that
has very good rebound properties. The cross-sectionof a typical billiard cushion is shown in Fig. 3. A slopeis usually provided in the cushion such that its contactpoint on the ball is always above the horizontal greatcircle of the ball, in order to prevent the ball from leap-ing up in the air after impact. The following analysisassumes that the cushion does not change its geom-etry during the impact with the ball. This assumptionmay not be valid at high ball speeds, as the normalball velocity at I (see Fig. 3), along the negative Z
′-axis,
will try to lift up the tip of the cushion. Also, the balland the cushion are assumed to have a point contact,which again may not be true at larger ball speeds, asthe ball will start to‘sink’ more into the rubber cushion.
Fig. 3 Forces acting on the ball at the moment of col-
lision: a side view along the cushion at tablelevel
Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science JMES1964

---- Page 2 ----
A theoretical analysis of billiard ball dynamics under cushion impacts 1865
Fig. 4 Forces on the ball during impact (a part of the
cushion is shown)
According to Fig. 3, the height of the contact point at
the rail (i.e. I) is h. In both snooker and pool h=7R/5,
where Ris the ball radius. The common normal line Z′,
at the contact point with the cushion, makes an angleofθwith the Y-axis, thus, sin θ=2/5.
2.1 General equations of motion
Referring to Fig. 4, for the linear motion of the ball
along the X-,Y-, and Z-directions, the following can
be written
F
I
x+FC
x=M¨xG (1a)
−FIcosθ−FI
y′sinθ+FC
y=M¨yG (1b)
−FIsinθ+FI
y′cosθ+FC−Mg=M¨zG (1c)
Within the duration of the collision of the ball with
the cushion, at any time instant t=τ, consider an
inﬁnitesimally small time period /Delta1τ. Now, let /Delta1P
denote the impulse or change in momentum due tothe action of a general force Fover/Delta1τ. Also, the accu-
mulated total impact up to time Tis denoted as P(and
assuming that the impact started at t=0); hence, it
can be written that
/Delta1P=∫
τ+/Delta1τ
τFdt (2a)
and
P=∑
/Delta1P=∫T
0Fdt (2b)
The impulse–momentum relationship in conjunction
with equation (2a), along the above directions resultsin the following equations
/Delta1P
I
x+/Delta1PC
x=M/Delta1˙xG (3a)
−/Delta1PIcosθ−/Delta1PI
y′sinθ+/Delta1PC
y=M/Delta1˙yG (3b)
−/Delta1PIsinθ+/Delta1PI
y′cosθ+/Delta1PC=M/Delta1˙zG (3c)
It should be noted that the impact component due to
the force of gravity acting on the ball, mg, is absentin equation (3c). According to de la Torre Juárez [ 14],
in the limit /Delta1t→0, the non-diverging forces, such as
the weight mg, will have a negligible contribution and
thus will not inﬂuence the increase in momentum. Itshould also be noted that the slope shape of the cush-ion constrains the vertical motion of the ball. Hence, inequation (3c), /Delta1˙z
G=0. Equation (3c) is rearranged as
/Delta1PC=/Delta1PIsinθ−/Delta1PI
y′cosθ (3d)
Similarly, for the rotational motion of the ball about
theX-axis, the following equation can be derived, with
angular velocity being denoted by ˙θ
(/Delta1PI
y′+/Delta1PC
y)R=I/Delta1˙θx
Where the moment of inertia of the ball I=2MR2/5,
the above equation can be written as
/Delta1PI
y′+/Delta1PC
y=2MR
5/Delta1˙θx (4a)
Similarly, about the Y-axis and the Z-axis
/Delta1PI
xsinθ−/Delta1PC
x=2MR
5/Delta1˙θy (4b)
−/Delta1PI
xcosθ=2MR
5/Delta1˙θz (4c)
2.2 Impact dynamics at I and C
At the contact point of the ball and the cushion, I, the
ball will generally slip on the cushion (rolling can betreated as a special case of slipping, where the slip-ping velocity is zero). The slip will take place on theXY
′plane (i.e. the tangential plane); also noting that
the axis Y′is in the YZplane. Let the slip speed of the
ball at I be s(t)at an angle /Phi1(t)with the X-axis. The
instantaneous value of the normal impulse PIaccord-
ing to equation (2b) will always be positive, sinceF
Iis always positive. In addition, PImonotonously
increases with time twithin the interval of impact.
Therefore, PIis considered as the independent vari-
able for the analysis of impact instead of the regularlyused variable of time t[15]. See Stronge [ 15] for an
elaborative explanation of the other principles usedwithin subsection 2.2.
Referring to Fig. 5, the slipping velocities along the
X-axis and the Y
′-axis are given by, respectively
˙xI=s(PI)cos[/Phi1(PI)] (5a)
˙y′
I=s(PI)sin[/Phi1(PI)] (5b)
However, ˙y′
Ican also be written as
˙y′
I=−˙yIsinθ+˙zIcosθ (6)
Using the Amontons–Coulomb law of friction, for
s>0, also noting that the friction forces/impulses
JMES1964 Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science

---- Page 3 ----
1866 S Mathavan, M R Jackson, and R M Parkin
Fig. 5 Slip velocities at I and C
are opposite to the direction of sliding, the friction
impulses along Xand Y′are
/Delta1PI
x=−μwcos[/Phi1(PI)]/Delta1PI (7a)
/Delta1PI
y′=−μwsin[/Phi1(PI)]/Delta1PI (7b)
where μwis the coefﬁcient of friction between the ball
and the cushion.
From equations (3a) and (7b), the normal reaction
from the table surface to the ball is given by
/Delta1PC={sinθ+μwsin[/Phi1(PI)]cosθ}/Delta1PI (8)
Using the earlier argument, for the impact at C, the
instantaneous impulse value PCshould be chosen
as the independent variable. However, equation (8)shows that the value of P
Cdirectly depends on the
value of PI. Hence, also for the impact at C, PIis con-
sidered as the independent variable. This makes itpossible to have P
Ias the independent variable for all
the impulse forces acting on the ball.
For the impact at C, the slip takes place within the XY
plane. Let s′be the slip speed and /Phi1′be the direction of
slip measured from the X-axis. Now, the components
ofs′along the X- and Y-directions are
˙xC=s′(PI)cos[/Phi1′(PI)] (9a)
˙yC=s′(PI)sin[/Phi1′(PI)] (9b)
Hereafter, the independent variable PIis omitted from
all equations for the sake of simplicity. When s′>0, at
C the impulse forces along the Xand Ydirections, also
using equation (8), are
/Delta1PC
x=−μscos/Phi1′/Delta1PC
=−μscos/Phi1′(sinθ+μwsin/Phi1cosθ)/Delta1 PI
(10a)
/Delta1PC
y=−μssin/Phi1′/Delta1PC
=−μssin/Phi1′(sinθ+μwsin/Phi1cosθ)/Delta1 PI
(10b)where μsis the coefﬁcient of friction between the
ball and the table surface.
2.3 Velocity relationships
The velocity of any point on the ball surface can be
expressed in vector notation as
V=VG+ωXR
where Vis the vector that represents the linear veloc-
ity of a point on the ball surface, vector VGstands for
the linear centroidal velocity of the ball, ωis the vec-
tor denoting the rotational speed of the ball about itscentroid, Ris the vector deﬁning the spatial location
of such a surface point in relation to the ball centre,and
Xdenotes the vector product, also known as the
cross product.
Hence
/Delta1V=/Delta1VG+/Delta1ωXR (11)
From equation (11), resolving components along the
axes appropriately, slip velocities along any axis canbe expressed in terms of the centroid velocities ofthe ball.
At I
/Delta1˙x
I=/Delta1˙xG+/Delta1˙θyRsinθ−/Delta1˙θzRcosθ (12a)
/Delta1˙y′
I=−/Delta1˙yGsinθ+/Delta1˙zGcosθ+/Delta1˙θxR (12b)
Similarly at C, along the X-axis
/Delta1˙xC=/Delta1˙xG−/Delta1˙θyR (13a)
and along the Y-axis
/Delta1˙yC=/Delta1˙yG+/Delta1˙θxR (13b)
Equations (12) and (13) make it possible to estimate
the slip velocities and the slip angles of the ball, bothat the table and at the cushion interface.
2.4 A description of ball dynamics
When substituting the expressions for /Delta1P
I
xand/Delta1PC
x
from equations (7a) and (10a) in equation (3a), /Delta1˙xG,
which is the increment in the centroid velocity in theXdirection ˙x
G, is expressed in terms of the slip angles
/Phi1and/Phi1′by
/Delta1˙xG=−1
M[μwcos/Phi1+μscos/Phi1′
×(sinθ+μwsin/Phi1cosθ)]/Delta1PI
Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science JMES1964

---- Page 4 ----
A theoretical analysis of billiard ball dynamics under cushion impacts 1867
As/Delta1PI→0 this equation will become
d˙xG
dPI=−1
M[μwcos/Phi1+μscos/Phi1′
×(sinθ+μwsin/Phi1cosθ)] (14a)
Similarly, it could be shown that
d˙yG
dPI=−1
M[cosθ−μwsinθsin/Phi1
+μssin/Phi1′(sinθ+μwsin/Phi1cosθ)] (14b)
d˙zG
dPI=0 (14c)
d˙θx
dPI=−5
2MR[μwsin/Phi1+μssin/Phi1′
×(sinθ+μwsin/Phi1cosθ)] (14d)
d˙θy
dPI=−5
2MR[μwcos/Phi1sinθ−μscos/Phi1′
×(sinθ+μwsin/Phi1cosθ)] (14e)
d˙θz
dPI=5
2MR(μwcos/Phi1cosθ) (14f)
The differential equations in equation (14) describe
the motion of the ball completely. The slip angles/Phi1and/Phi1
′can be replaced by the centroidal veloc-
ities{˙xG,˙yG,˙zG,˙θx,˙θy,˙θz}, by using the relationships
derived in section 2.3, resulting in six simultaneousﬁrst-order, second-degree, differential equations in{˙x
G,˙yG,˙zG,˙θx,˙θy,˙θz}. An analytical solution for these
differential equations is extremely difﬁcult to ﬁnd.However, a numerical solution is still possible, and theforms as given in equation (14) can be directly used inthe numerical scheme.
3 NUMERICAL SOLUTION
As seen already, the solution to the set of six differ-
ential equations will involve a numerical method. Thenumerical algorithm has to be supplied with the initialconditions for the ball velocity, the conditions underwhich different motion transitions (such as slidingto rolling) take place, and numerical values for theparameters involved in the equations, such as μ
s.
3.1 Initial conditions
Referring to Fig. 2, the initial conditions for the
centroid velocities of the ball are
(˙xG)1=V0cosα,(˙yG)1=V0sinα,(˙zG)1=0,
(˙θx)1=−ωT
0sinα,(˙θy)1=ωT
0cosα, and
(˙θz)1=ωS
0the initial slip speeds at I and C are
s(0)=⏐⏐⏐⏐⏐√
[V0cosα+R(ωT
0cosαsinθ−ωS
0cosθ)]2
+[ − V0sinαsinθ−RωT
0sinα]2⏐⏐⏐⏐⏐
s
′(0)=|V0−RωT
0|
and the slip angles are
/Phi1(0)=tan−1[−V0sinαsinθ−RωT
0sinα
V0cosα+R(ωT
0cosαsinθ−ωS
0cosθ)]
/Phi1′(0)={
α for V0−RωT
0>0
180◦+αfor V0−RωT
0<0
where αis the incident angle of the ball.
/Phi1′(0)is not deﬁned for the condition V0−RωT
0=0,
as the ball rolls on the table under this condition.
3.2 Friction coefﬁcients and conditions for rolling
During the rolling phase slip speed s(ors′for the slid-
ing on the table-felt) becomes zero. In this instance,the relative motion between bodies stops at theircontact point along the common tangent and thefrictional forces become null (the effects of stick areneglected).
1. For the condition s=0, the ball will be rolling on
the cushion at I. /Delta1P
I
x=/Delta1PI
y′=0, and from equation
(3c),/Delta1PC=0. Hence
/Delta1PC
x=/Delta1PC
y=0 (15a)
2. For the condition s′=0, the ball will roll on the table
surface, and
/Delta1PC
x=/Delta1PC
y=0 (15b)
High-speed-camera-based measurements were used,
in a previous work by the present authors, to determinethe sliding coefﬁcient of friction between a snookerball and the table-felt; the sliding coefﬁcient of fric-tionμ
swas found to be between 0.178 and 0.245 [ 16].
Marlow [ 12] suggests a value of 0.2 for the game of
pool. Since the present authors have performed exten-sive measurements of the various parameters relatedto snooker [ 16], from here onwards the numerical val-
ues found in snooker are used for the calculations. μ
sis
assumed to be 0.212, as an average value. For a snookerball, M=0.1406 kg and R=26.25 mm.
3.3 Coefﬁcient of restitution and impact
mechanics
According to Stronge [ 15], the energetic coefﬁcient of
restitution e
eis independent of friction and the process
of slip. e2
eis the negative of the ratio of the work done
JMES1964 Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science

---- Page 5 ----
1868 S Mathavan, M R Jackson, and R M Parkin
by the impulse force during the restitution phase to
that during the compression phase. The work done atI by the forces acting along the axis Z
′is
/Delta1WZ′
I=∫τ+/Delta1τ
τFI˙z′
Idt=∫PI+/Delta1PI
PI˙z′
IdPI
Its numerical form is
(WZ′
I)n+1−(WZ′
I)n=/Delta1PI[(˙z′
I)n+1+(˙z′
I)n]
2(16a)
where ˙z′
Iis the relative velocity between the ball and
the cushion in the direction of the common normal at I(here it is assumed that the cushion does not move suf-ﬁciently to affect a change in the relative velocity (i.e.the cushion is treated as a rigid body)). F
Iis the normal
force from the cushion acting on the ball. When Pf
Iand
Pc
Idenote the accumulated impulse at the termina-
tion of impulse and at the termination of compression,respectively, it can be shown that [ 15]
e
2
e=−∫Pf
I
Pc
I˙z′
IdPI
∫Pc
I
0˙z′
IdPI
Rearranging the equation
WZ′
I(Pf
I)=(1−e2
e)WZ′
I(Pc
I) (16b)
The termination of compression occurs when the nor-
mal component of the relative velocity becomes zero,that is
˙z
′
I(Pc
I)=0 (16c)
According to Marlow [ 12], the coefﬁcient of restitu-
tion between the cushion and the ball, ee, is 0.55 for
pool. However, the authors of this work have obtainedan experimental plot for the ball–cushion impact insnooker, where a snooker ball, under the conditions ofrolling ( ω
T
0=V0/R)and no sidespin ( ωS
0=0), was shot
to collide with the cushion perpendicularly ( α=0),
and tracked using a machine vision camera [ 15]. The
incident versus rebound speed plot obtained was usedto conclude that the equivalent coefﬁcient of restitu-tion for a rolling ball perpendicularly colliding withthe cushion has a value of 0.818, on average; theexperimental procedure is brieﬂy outlined in section3.5. Here it must be noted that the value of 0.818incorporates the effects of friction and the three-dimensionality of the impulse conﬁguration, and onlystands as a representative value for the coefﬁcient ofrestitution.3.4 Numerical algorithm
Equations (14) have equivalent algebraic forms as
(˙x
G)n+1−(˙xG)n=−1
M{μwcos(/Phi1) n+μscos(/Phi1′)n
×[sinθ+μwsin(/Phi1) ncosθ]}/Delta1PI
(17a)
where, using equation sets (12) and (13)
tan(/Phi1) n=−(˙yG)nsinθ+(˙zG)ncosθ+(˙θx)nR
(˙xG)n+(˙θy)nRsinθ−(˙θz)nRcosθ
and
tan(/Phi1′)n=(˙yG)n+(˙θx)nR
(˙xG)n−(˙θy)nR
A numerical scheme is written in MATLAB®program-
ming language. The values of V0,ωT
0,ωS
0, and αare
the inputs to the scheme. The scheme calculates thechanges in the values of V
0,ωT
0,ωS
0, andαby increment-
ing PIin small step sizes. The smaller the value of the
increment in impulse PI(i.e./Delta1PI) in equation (15a), the
more accurate the results. The aim is to ﬁnd the cen-troid velocities of the balls at the ﬁnal accumulatedimpulse value P
f
I.
The numerical scheme, as shown in Fig. 6, starts by
calculating the initial centroidal velocities and the cor-responding slip speeds and slip angles as illustratedin section 3.1. In addition, arrays to store the inter-mediate values of the centroidal velocities and slipspeeds and slip angles for each increment in the formof/Delta1P
Iare also initiated. Then the algorithm continues
its operation by calculating increments in the cen-troid velocities of the ball by using equation (17a) andﬁve other simultaneous equations. Using these incre-ments and equations (12a), (12b), (13a), and (13b) thenew slip velocities are calculated. The code is designedto incorporate the modiﬁcations necessary when arolling condition is reached at either of the slidingcontacts, as given in equations (15a) and (15b). Thevalues of ball velocities are saved as arrays, includingthe work done at I along the Z
′-axis (i.e. WZ′
I, calculated
from equation (16a)). The latest parameter values areappended to these arrays once each /Delta1P
Iis applied.
Again, Pf
Icannot be found analytically and has to
be obtained numerically using equations (16a) and(16b). The numerical scheme is initially stopped when
˙z
′
I=0 (i.e. when the compression phase has ended),
and the corresponding value of work done is obtainedfrom the array containing W
Z′
I, which will be WZ′
I(Pc
I).
Now, using equation (16b), the value WZ′
I(Pf
I)can be
calculated, given that eeis known. The numerical pro-
cess of incrementing PIcan resume again, and when
WZ′
I=WZ′
I(Pf
I), the process is terminated. The rebound
velocity values of the ball centroid are the last entriesin the arrays of the respective velocity components.
Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science JMES1964

---- Page 6 ----
A theoretical analysis of billiard ball dynamics under cushion impacts 1869
Fig. 6 Flowchart of the numerical algorithm
Note: in order to start the numerical scheme, a
reasonable value for /Delta1PIhas to be assumed. An
approximate value for Pf
Ican be assumed to be
(1+ee)MV 0sinα, which is the value of the ﬁnal accu-
mulated normal impulse for a horizontally moving,non-spinning ball colliding into a solid vertical wall.Hence, approximately for Niterations, /Delta1P
I=[(1+
ee)MV 0sinα/N]. Obviously the values of Pc
Iand Pf
I
will decide the actual number of iterations that have
taken place in the scheme. An initial Nof 5000 worked
satisfactorily for the scheme.3.5 Estimating eeandμw
The experimental plot in Fig. 7 was obtained under
the conditions of ωS
0=0,α=90◦, and ωT
0=V0/R,o n
a Riley®Renaissance-type snooker table, which is also
the ofﬁcial table brand of the World Snooker Associa-tion and is used in all its professional tournaments.
The ball speed is calculated from an experimental
procedure involving a stationary high-speed camera(the general experimental procedure is explained inMathavan et al .[16]). It is known that 0 <e
e⩽1. For
JMES1964 Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science

---- Page 7 ----
1870 S Mathavan, M R Jackson, and R M Parkin
Fig. 7 Rebound speed versus incident velocity, obtained experimentally and numerically
each of the experimentally obtained incident speed
values (i.e. V0) in the speed range V0<1.5 m/s, the
numerical algorithm was run for values of eeand
μwbetween 0 and 1 in increments of 0.01, and the
rebound speed ˙yG(Pf
I)was obtained. Higher incident
speeds were not considered, as the assumption of arigid cushion may not then be applicable. The valuesofe
eandμwthat minimize the root mean square (RMS)
value of the error between the experimental and thenumerically predicted rebound speeds should be theactual value for the coefﬁcient of restitution betweenthe cushion and the ball. Calculations showed thatthe RMS error was a minimum when e
e=0.98 and
μw=0.14.
Numerically obtained rebound speed values for
ee=0.98 and μw=0.14 are plotted in Fig. 7 together
with the experimentally obtained values. As seen inFig. 7(b), numerically obtained values of the incidentspeed deviate from the experimentally obtained values
for speeds V
0>2.5 m/s. V0>2.5 m/s is, quite possibly,
the velocity limit under which the rigid body assump-tion for the cushion would be valid. V
0=2.5 m/s is
a considerably high ball speed as far as snooker isconcerned. For oblique shots, only the ones for whichthe normal component of the incident velocity of lessthan 2.5 m/s would be analysed using the numericalalgorithm described in section 3.4.
4 RESULTS AND DISCUSSION
The results obtained from the numerical algorithm for
various speed–spin combinations are given in Figs 8to 10.
In billiards, once the ball is struck by the cue stick,
the ball generally slides, where ω
T
0̸=V0/R. However,
Fig. 8 Rebound speed and rebound angle versus incident angle for different rolling velocities with
no sidespin ( ωT
0=V0/R,ωS
0=0)
Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science JMES1964

---- Page 8 ----
A theoretical analysis of billiard ball dynamics under cushion impacts 1871
Fig. 9 Rebound speed and rebound angle versus incident angle for different topspins of the ball,
ωT
0=kV0/Rand V0=1 m/s with no sidespin ( ωS
0=0)
Fig. 10 Rebound speed and rebound angle versus incident angle for different sidespins of the ball,
ωS
0=kV0/Rand V0=1 m/s with the ball rolling ( ωT
0=V0/R)
the rolling condition of ωT
0=V0/Ris quickly achieved
by the action of friction between the ball and the table(an interested reader can refer to the camera-basedtracking plots given in reference [ 16]). Hence, in most
instances, the ball is likely to be in rolling mode whenit collides with a cushion, also possibly with somesidespin. The plots for the simplest case of rolling withno sidespin are shown in Fig. 8. The plot of reboundspeed versus incident angle for different incident ballspeeds clearly shows the monotonous variation ofthe rebound speed with the incident speed. The sec-ond plot in Fig. 8 shows that the rebound angle plotsare identical for different ball speeds. The plot sug-gests that the rebound angle is inﬂuenced only by theincident angle for a rolling ball with no sidespin prior
to the impact.
Figure 9 depicts the rebound conditions for a ball
incident speed of 1 m/s with different types of spincolliding with the cushion at different incident angles.According to Fig. 9, when the ball is overspinningbefore the collision, its rebound tends to be generallyhigher. When the topspin of the ball is ω
T
0=2V0/R,a t
a9 0◦incident angle, the rebound speed reaches the
incident speed value of V0. For any given speed–spin
conditions, the speed loss is largest for the ball inci-dent angles around 40
◦. The rebound angles are not
greatly affected by the excessive topspin of the ball asseen in the second plot of Fig. 9.
JMES1964 Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science

---- Page 9 ----
1872 S Mathavan, M R Jackson, and R M Parkin
Figure 10 shows the rebound characteristics for a
rolling ball with different sidespin values. The plotsprovide some very interesting results. Also, when theball has right spin (according to billiards terminology,the direction of ω
S
0–a sm a r k e di nF i g .2–i s called right
spin, the opposite of which is left spin), the reboundspeed exceeds the value of the incident speed. In addi-tion, for higher values of left spin, at higher incidentangles towards 90
◦, the rebound velocity exceeds the
value of the incident ball speed. The second plot inFig. 10 suggest that when the ball has left spin ( k<0),
and for incident angle values close to 90
◦, the ball
bounces back to the side from which it approached thecushion (see Fig. 11). This effect of the ball reboundingto the same side has been described by Walker [ 17]
for billiards, and by Cross [ 18] in a general context
for the bounce of a ball. Cross [ 18] also provides the
experimental results for the rebound characteristicsof a tennis ball bouncing on a rough surface.
A plot of sliding speeds against the instantaneous
impulse value is shown in Fig. 12. The change in slipdirections as indicated by the plot suggests that theassumption of unidirectional slip cannot be true.
Fig. 11 Ball bouncing back to the same side under left
spin conditions for α’s close to 90◦
Fig. 12 Slip–impulse curves for V0=2 m/s, α=45◦,
ωS
0=2V0/R, and ωT
0=1.5V0/R(sand/Phi1are for
the slip at the cushion, and s′and/Phi1′are for the
slip at the table)5 CONCLUSIONS
A 3D impact analysis for the collision of a spinning
billiard ball with a cushion is presented. Differen-tial equations are derived for ball dynamics duringthe time of impact and then the solutions are foundnumerically.
Combining some of the authors’ previous experi-
mental results with the numerical solutions, the coef-ﬁcient of restitution for the ball–cushion collision isdetermined as 0.98. In addition, the value for thesliding coefﬁcient of friction is found to be 0.14.
The rebound angles and speeds are given as plots
against the incident angles and speeds for differ-ent velocities and spin conditions. Under excessivesidespin conditions, the rebound speeds are found toexceed the incident speeds and the ball is also foundto bounce back on the side from which it approachedthe cushion.
Although this analysis provides the quantiﬁcation
for many phenomena involved with cushion collisionsthat are described in the billiards literature, it isexpected to be validated by tracking the spin of a bil-liard ball. A colour pattern drawn on a white cue ballmay be used for this purpose.
© Authors 2010
REFERENCES
1 Nadler, D. Mathematical theory of spin, friction, and
collision in the game of billiards , 2005. An English trans-
lation of Coriolis’ 1835 book (Nadler, D., San Francisco,California, USA).
2 Long, F ., Herland, J., Tessier, M.-C., Naulls, D., Roth, A.,
Roth,G., and Greenspan,M. Robotic pool: an experiment
in automatic potting. In Proceedings of the IROS’04:IEEE/RSJ International Conference on Intelligent and
robotics and systems , Sendai, Japan, 2004, vol. 3, pp.
2520–2525.
3 Ho, K. H. L., Martin, T., and Baldwin, J. Snooker robot
player – 20 years on. In Proceedings of the IEEE Sym-posium on Computational intelligence and games (CIG
2007), Hawaii, 1–5 April 2007, pp. 1–8.
4 Cheng, B.-R., Li, J.-T., and Yang, J.-S. Design of the
neural-fuzzy compensator for a billiard robot. In Pro-ceedings of the 2004 IEEE International Conference onNetworking, sensing and control , Taipei, Taiwan, 21–23
March 2004, pp. 909–913.
5 Alian, M. E., Shouraki, S. E., Shalmani, M. T. M.,
Karimian, P ., and Sabzmeydani, P . Roboshark: a gantry
pool player. In Proceedings of the 35th InternationalSymposium on Robotics (ISR), Paris, France, 2004.
6 Jebara,T.,Eyster,C.,Weaver,J.,Starner,T., and Pentland,
A.Stochasticks: augmenting the billiards experience with
probabilistic vision and wearable computer. In Proceed-ings of the IEEE International Symposium on Wearable
computers , Cambridge, MA, USA, October 1997, pp.
138–145.
Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science JMES1964

---- Page 10 ----
A theoretical analysis of billiard ball dynamics under cushion impacts 1873
7 Larsen, L. B., Jensen, M. D., andVodzi,W. K. Multi modal
user interaction in an automatic pool trainer. In Pro-ceedings of the Fourth IEEE International Conference onMultimodal interfaces (ICMI’02), Pittsburgh, USA, 14–16
October 2002, pp. 361–366.
8 Uchiyama, H. and Saito, H. AR display of visual aids
for supporting pool games by online markerless track-ing. In Proceedings of the 17th International ConferenceonArtiﬁcial reality and telexistence (ICAT 2007), Esbjerg,
Denmark, 28–30 November 2007, pp. 172–179.
9 Smith, M. PickPocket: a computer billiards shark. Artif.
Intell. , 2007, 171(16–17), 1069–1091.
10 Dussault,J.-P . and Landry,J.-F . Optimization of a billiard
player – tactical play. Lect. Notes Comput. Sci. , 2007, 4630 ,
256–270.
11 Leckie, W. and Greenspan, M. An event-based pool
physics simulator. Lect. Notes Comput. Sci. , 2006, 4250 ,
247–262.
12 Marlow,W. C. The physics of pocket billiards , 1994 (MAST,
Florida, USA).
13 Alciatore, D. G. Pool and billiards physics principles by
coriolis and others. Am. J. Phys. (submitted), available
from http://billiards.colostate.edu/physics/Alciatore_AJP_MS22090_revised_pool_physics_article.pdf. (accessdate 20 January 2009).
14 de la Torre Juárez, M. The effect of impulsive forces on
a system with friction: the example of the billiard game.Eur . J. Phys. , 1994, 15(4), 184–190.
15 Stronge, W. J. Impact mechanics , 2000 (Cambridge Uni-
versity Press, Cambridge, UK).
16 Mathavan, S., Jackson, M. R., and Parkin, R. M. Applica-
tion of high-speed imaging in determining the dynamicsinvolved in billiards. Am. J. Phys. , 2009, 77(9), 788–794.
17 Walker, J. The physics of the follow, the draw and
the masse (in billiards and pool). Sci. Am. , 1983, 249,
124–129.
18 Cross, R. Bounce of a spinning ball near normal inci-
dence. Am. J. Phys. , 2005, 73(10), 914–992.APPENDIX
Notation
ee coefﬁcient of restitution between the ball
and the cushion
F force
I moment of inertia of the ball
M mass of the ball
N number of iterations
P accumulated impulse at any time during
impact
Pc
I accumulated impulse at the termination
of compression
Pf
I the ﬁnal accumulated value of
impulse
R radius of the ball
s slip speed
V0 incident speed of the ball
W work done due to impulse force
α ball incident angle with the cushion
β rebound angle
/Delta1P impulse during a time of /Delta1t
θ the angle that the common normal of the
ball–cushion contact point makes withthe horizontal
˙θ angular velocity of the ball
μ
s coefﬁcient of sliding friction between the balland the table
μ
w coefﬁcient of sliding friction between the balland the cushion
/Phi1 direction of slip
ω
S
0 sidespin of the ball at incidence
ωT
0 topspin of the ball at incidence
JMES1964 Proc. IMechE Vol. 224 Part C: J. Mechanical Engineering Science