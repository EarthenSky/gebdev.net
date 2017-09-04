# earthensky.github.io
Websites are probably useful.

**Right now this is just a test website [^-^]**

**Code Style:**
===============

Code Sections:

  - Code sections are broken up and named inside of a script in a few main ways:

    Starting a code section.  

  ```
  //< + nameOfSection + ' ' + Start
  //ex.
  //<CollisionCode Start
  ```

    Ending a code section.

  ```
  //nameOfSection + ' ' + End + />
  //ex.
  //CollisionCode End/>
  ```

    Emphasizing or tagging a function.

  ```
  //!nameOfEmphasis!
  //ex.
  //!Combat!
  ```

    Noting when statements would be activated.  

  ```
  //case: situation that would activate a statement
  //ex.
  //case: player has been hit with an electric weapon and doesn't die.
  if(enemyHasWeapon === true && weaponType === 'electric' && playerIsHit == true && playerHealth > 0) {
    addShockedDebuff('player');
  }
  ```

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
