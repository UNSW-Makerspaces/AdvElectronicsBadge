# <AChip class="rounded-0"><h1 color="inherit">Part 1:</h1></AChip> Board Preparation

<br>
<ACard 
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 400px;"
variant="outline">
<small><center>IMAGE OF THE PICOGAMEPAD PCB UNPOPULATED</center></small>
</ACard>

## 1. Prepare PCB, Components

The first step is to collect the PCB, and the components that need to be soldered to the PCB. 
A tray is provided, (below) that contains all of the necessary surface mounted components that 
are used within this induction, as well as a pair of tweezers. 

<br>
<ACard 
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 300px;"
variant="outline">
<small><center>IMAGE OF COMPONENTS TRAY & PCB side by side</center></small>
</ACard>
<small><center>A tray with components used in the induction, organised in advance.</center></small> 
<br>

In groups of **5 people**, a simply "stencil holder" jig, along with a stencil is additionally
provided for parts 1-3 of this induction. 

<!-- {{{1 Stencil Equipment: col-2 -->

<br>

<div class="grid-row sm:grid-cols-2 pl-5" >

<div class="ps-1"> 
<ACard 
class="w-full"
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 200px;"
variant="outline">
<small><center>IMAGE OF STENCIL JIG</center></small>
</ACard>
<small><center>A populated stencil holding jig, without a stencil.</center></small> 
</div>

<div>
<ACard 
class="ps-1"
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 200px;"
variant="outline">
<small><center>IMAGE OF STENCIL</center></small>
</ACard>
<small><center>A stencil used for solder-paste deposition.</center></small> 
</div>

</div>
<br>

<!-- }}} -->

It is recommended that you make sure you have all the components that you need before starting 
[part 3][2]. A graphical bill-of-materials (BOM) and preview of the PCB, can be found in
[resources][3].

Looking for in-depth information about how stencils work? A write-up can be found [here][4].

## 2. Applying Solder-Paste 

Using provided "Solder-paste" (often abbreviated as ["solderpaste"][5]) and the stencil fixture, 
a thin layer of tiny solder balls suspended in ["flux"][6] can be applied in specific
places, at a specific thickness.

<!-- {{{1 Solderpaste: col-2 -->

<br>

<div class="grid-row sm:grid-cols-2 pl-5" >

<div class="ps-1"> 
<ACard 
class="w-full"
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 200px;"
variant="outline">
<small><center>IMAGE OF BOARD PAD WITHOUT SOLDERPASTE</center></small>
</ACard>
<small><center>A "pad", which is later paired with a corresponding "pin".</center></small> 
</div>

<div>
<ACard 
class="ps-1"
color="grey"
style="background-color: var(--vp-c-mute-darker); width: auto; height: 200px;"
variant="outline">
<small><center>IMAGE OF BOARD PAD WITH SOLDERPASTE</center></small>
</ACard>
<small><center>After stencil application, it is coated in solderpaste.</center></small> 
</div>

</div>
<br>

<!-- }}} -->

To apply the stencil to the PCB with the solderpaste, repeat the following steps (images shown).

<AAlert color="warning">
Doesn't exist, don't know how to document this!
</AAlert>

## 3. Common Mistakes 

If solderpaste is applied incorrectly, your reflow attempt may fail or be difficult to complete. 
Generally, you must ensure that: 

::: details The solderpaste is in the correct location



Determining if this is the case should be easy, as all of the pads intended for reflow, clearly
should have paste covering them, and the paste should not "spill" over them or be offset. 

<!-- {{{1 Solderpaste Problem 1: col-2 -->

<br>

<div class="grid-row sm:grid-cols-2 pl-5" >

<div class="ps-1"> 
<ABadge  color="danger" >
<ACard 
class="w-full"
color="danger"
style="width: auto; height: 200px;"
variant="light">
<small><center>IMAGE OF WRONG SOLDERPASTE APPLICATION</center></small>
</ACard>
</ABadge>
</div>

<div>
<ABadge color="success">
<ACard 
class="ps-1"
color="success"
style="width: auto; height: 200px;"
variant="light">
<small><center>IMAGE OF CORRECT SOLDERPASTE APPLICATION</center></small>
</ACard>
</ABadge>
</div>

</div>
<br>

<!-- }}} -->

:::

::: details Solderpaste is "overprinted"

When too much solderpaste is applied (not enough pressure used) during the stencil "print",
the effect is "overprinted". Or, **the solderpaste has been applied too heavily**.

See below, for a good comparison of "overprinted" and "adequately printed". 

<!-- {{{1 Solderpaste Problem 2: col-2 -->

<br>

<div class="grid-row sm:grid-cols-2 pl-5" >

<div class="ps-1"> 
<ABadge  color="danger" >
<ACard 
color="danger"
style="height: 200px;"
variant="light">
<small><center>IMAGE OF OVERPRINT</center></small>
</ACard>
</ABadge>
</div>

<div>
<ABadge color="success">
<ACard 
color="success"
style=" height: 200px;"
variant="light">
<small><center>IMAGE OF CORRECT PRINT</center></small>
</ACard>
</ABadge>
</div>

</div>
<br>

<!-- }}} -->

<AAlert color="info"><b>Note:</b> Usually, this is not something you have to consciously
achieve</AAlert>

:::

[1]:  / ""
[2]:  /exercises/3/ "Induction Part 3"
[3]:  / ""
[4]:  / ""
[5]:  / ""
[6]:  / ""
[7]:  / ""
[8]:  / ""
[9]:  / ""
[10]: / ""
[11]: / ""
[12]: / ""
[13]: / ""
[14]: / ""
[15]: / ""
[16]: / ""
[17]: / ""
[18]: / ""
[19]: / ""
