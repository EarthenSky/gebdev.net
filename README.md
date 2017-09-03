# earthensky.github.io
Websites are probably useful.

**Right now this is just a test website [^-^]**

**Code Style:**
===============

Code Sections:

  - Code sections are broken up inside of a script with:

  ```
  //< + nameOfSection + ' ' + Start
  ex.
  //<CollisionCode Start
  ```

  to start a section.  

  ```
  //nameOfSection + ' ' + End + />
  ex.
  //CollisionCode End/>
  ```

  to end a section.  

  ```
  //!nameOfEmphasis!
  ex.
  //!Combat!
  ```

  is used to emphasize or tag a function.    

  ```
  //case: situation that calls a statement
  ex.
  //case: player has been hit with an electric weapon.
  if(weapon === true && weaponType === 'electric' && playerIsHit == true) {
    foo();
  }
  ```

  is used to say when a statement would be activated.  

  - Code sections are only for reference and ease of code readability.
  - Section starts and ends are based off of html tags.

Comments:

  - Comments come after a double space.

  ```
  if(foo() === true) { foo(); }  //foo again!
  ```

  - No comment punctuation or spelling.

Bracket Style:  

  - This code uses the K&R variant *Stroustrup*.
