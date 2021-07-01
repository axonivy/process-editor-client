[Ivy]
179A8FA94986019A 9.3.0 #module
>Proto >Proto Collection #zClass
tt0 test Big #zClass
tt0 B #cInfo
tt0 #process
tt0 @AnnotationInP-0n ai ai #zField
tt0 @TextInP .type .type #zField
tt0 @TextInP .processKind .processKind #zField
tt0 @TextInP .xml .xml #zField
tt0 @TextInP .responsibility .responsibility #zField
tt0 @StartRequest f0 '' #zField
tt0 @EndTask f1 '' #zField
tt0 @Split f5 '' #zField
tt0 @PushWFArc f2 '' #zField
tt0 @GridStep f3 '' #zField
tt0 @PushWFArc f4 '' #zField
tt0 @PushWFArc f6 '' #zField
tt0 @TaskSwitch f9 '' #zField
tt0 @Alternative f10 '' #zField
>Proto tt0 tt0 test #zField
tt0 f0 outLink start.ivp #txt
tt0 f0 inParamDecl '
<>
param;' #txt
tt0 f0 requestEnabled true #txt
tt0 f0 triggerEnabled false #txt
tt0 f0 callSignature start() #txt
tt0 f0 caseData businessCase.attach=true #txt
tt0 f0 @C|.xml '
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<elementInfo>
<language>
<name>
start.ivp
</name>
</language>
</elementInfo>
' #txt
tt0 f0 @C|.responsibility Everybody #txt
tt0 f0 129 113 30 30 -25 17 #rect
tt0 f1 481 113 30 30 0 15 #rect
tt0 f5 384 112 32 32 0 16 #rect
tt0 f2 expr out1 #txt
tt0 f2 416 128 481 128 #arcP
tt0 f2 1 442 160 #addKink
tt0 f2 1 0.09135087655743922 0 0 #arcLabel
tt0 f3 actionTable 'out=in;
' #txt
tt0 f3 216 106 112 44 0 -7 #rect
tt0 f4 159 128 216 128 #arcP
tt0 f6 328 128 384 128 #arcP
tt0 f9 actionTable 'out=in1;
' #txt
tt0 f9 400 240 32 32 0 16 #rect
tt0 f10 384 184 32 32 0 16 #rect
>Proto tt0 .type workflow.humantask.Data #txt
>Proto tt0 .processKind NORMAL #txt
>Proto tt0 .xml '
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<elementInfo>
<language>
<swimlaneLabel>
pool
</swimlaneLabel>
<swimlaneLabel>
lane1
</swimlaneLabel>
<swimlaneLabel>
lane2
</swimlaneLabel>
</language>
<swimlaneOrientation>
false
</swimlaneOrientation>
<swimlaneSize>
384
</swimlaneSize>
<swimlaneSize>
192
</swimlaneSize>
<swimlaneSize>
192
</swimlaneSize>
<swimlaneColor gradient="false">
-1
</swimlaneColor>
<swimlaneColor gradient="false">
-1
</swimlaneColor>
<swimlaneColor gradient="false">
-1
</swimlaneColor>
<swimlaneType>
POOL
</swimlaneType>
<swimlaneType>
LANE_IN_POOL
</swimlaneType>
<swimlaneType>
LANE_IN_POOL
</swimlaneType>
<swimlaneSpaceBefore>
32
</swimlaneSpaceBefore>
<swimlaneSpaceBefore>
0
</swimlaneSpaceBefore>
<swimlaneSpaceBefore>
0
</swimlaneSpaceBefore>
</elementInfo>
' #txt
>Proto tt0 0 0 32 24 18 0 #rect
>Proto tt0 @|BIcon #fIcon
tt0 f5 out f2 tail #connect
tt0 f2 head f1 mainIn #connect
tt0 f4 head f3 mainIn #connect
tt0 f6 head f5 in #connect
tt0 f0 mainOut f4 tail #connect
tt0 f3 mainOut f6 tail #connect
