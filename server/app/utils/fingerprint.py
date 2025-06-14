from flask import request
from user_agents import parse

from flask import current_app

def get_client_fingerprint(ip,
    ua_os_family,
    ua_os_version_str, 
    ua_browser_family, 
    ua_is_mobile, 
    static_salt
    ):
    # ua = parse(request.user_agent.string)
    
    # components = {
    #     'ip': ip,
    #     'device': {
    #         'os': f"{ua_os_family}/{ua_os_version_str}",
    #         'browser': ua_browser_family,
    #         'is_mobile': ua_is_mobile
    #     },
    #     'salt': current_app.config["STATIC_SALT"]
    # }
    
    # return hashlib.blake2b(
    #     json.dumps(components, sort_keys=True).encode(),
    #     digest_size=16 
    # ).hexdigest()

    return '212ewsfdsfd'

