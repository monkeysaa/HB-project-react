function About() {
    return (
        <React.Fragment>
        <header>
          <Link to="/"><img src='/static/img/desk-trans.png'/> </Link>
          <Link to="/"><h1>DESK</h1></Link>
        </header>
          <section id='greeting login'>
              <h2>Thanks!</h2>
              <input 
                type="text" 
                placeholder='DESK by Alison Cordeiro'
                onChange={(e) => setEmail(e.target.value)}
                value={email} 
              />
              <input 
                type="password" 
                onChange={(e) => setPassword(e.target.value)}
                placeholder='m=/github/monkeysaa'
                value={password} 
              />
          </section>
          {/* <React.Fragment>
        <form id='signup'>
          <h2>{greeting}</h2>
          <input 
            type="text" 
            placeholder='Username'
            onChange={(e) => setHandle(e.target.value)}
            value={handle} 
          />
          <input 
            type="text" 
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            value={email} 
          />
          <input 
            type="text" 
            placeholder='Password'
            onChange={(e) => setPass(e.target.value)}
            value={pass} 
          />
          <p id='welcome-footnote'>Already a user?</p>
          <div className='greeting-btns'>
            <button type='button' id='secondary-btn' onClick={handleLogin}>Sign In</button>
            <button type='button' id='primary-btn' onClick={handleSignup}>Sign Up</button>
          </div>
        </form>
    </React.Fragment> */}
        </React.Fragment>
      );
}