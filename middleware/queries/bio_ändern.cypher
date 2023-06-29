MATCH (u:User { name: ${user }})
 SET u.bio = ${ bio }
 SET u.name = ${ new_name }
RETURN u
